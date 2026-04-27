package com.unisync.service.impl;

import com.unisync.dto.BookingRequestDTO;
import com.unisync.dto.BookingResponseDTO;
import com.unisync.entity.Booking;
import com.unisync.entity.Resource;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.enums.BookingStatus;
import com.unisync.enums.NotificationType;
import com.unisync.exception.BookingConflictException;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.repository.BookingRepository;
import com.unisync.repository.ResourceRepository;
import com.unisync.repository.UserRepository;
import com.unisync.service.BookingService;
import com.unisync.service.NotificationService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public BookingServiceImpl(BookingRepository bookingRepository,
                              ResourceRepository resourceRepository,
                              UserRepository userRepository,
                              NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Override
    public BookingResponseDTO createBooking(BookingRequestDTO request, String userId) {
        // Check if resource exists and is bookable
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found"));

        if (!resource.isBookable()) {
            throw new RuntimeException("This resource is not available for booking.");
        }

        // Validate start/end sequence
        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new RuntimeException("Booking end time must be after the start time.");
        }

        // Check for conflicts (Only block if there is already an APPROVED booking)
        List<Booking> approvedConflicts = bookingRepository.findOverlappingApprovedBookings(
                request.getResourceId(), request.getDate(), request.getStartTime(), request.getEndTime());
        
        if (!approvedConflicts.isEmpty()) {
            throw new BookingConflictException("The resource is already reserved for the selected time range.");
        }

        // Validate operational hours
        if (resource.getAvailabilityStartTime() != null && request.getStartTime().isBefore(resource.getAvailabilityStartTime())) {
            throw new RuntimeException("Selected start time is before the resource's operating hours (" + resource.getAvailabilityStartTime() + ")");
        }

        if (resource.getAvailabilityEndTime() != null && request.getEndTime().isAfter(resource.getAvailabilityEndTime())) {
            throw new RuntimeException("Selected end time is after the resource's operating hours (" + resource.getAvailabilityEndTime() + ")");
        }

        // Validate capacity
        if (resource.getCapacity() != null && request.getAttendees() != null && request.getAttendees() > resource.getCapacity()) {
            throw new RuntimeException("Number of " + (resource.getType() == com.unisync.enums.ResourceType.EQUIPMENT ? "items" : "attendees") + 
                " exceeds the resource capacity (" + resource.getCapacity() + ")");
        }

        Booking booking = Booking.builder()
                .resourceId(request.getResourceId())
                .userId(userId)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .purpose(request.getPurpose())
                .attendees(request.getAttendees())
                .status(BookingStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Notify all admins of the new booking request
        String resourceNameForNotif = resource.getName();
        notificationService.createBroadcastNotification(
                Role.ADMIN,
                "New Booking Request",
                "A new booking request for \"" + resourceNameForNotif + "\" has been submitted and requires your review.",
                NotificationType.NEW_BOOKING_REQUEST,
                savedBooking.getId(),
                null, null, "All Administrators"
        );

        return mapToResponseDTO(savedBooking);
    }

    @Override
    public List<BookingResponseDTO> getUserBookings(String userId) {
        return bookingRepository.findByUserId(userId).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponseDTO> getAllBookings() {
        return bookingRepository.findAll().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public BookingResponseDTO updateBookingStatus(String bookingId, BookingStatus status, String rejectionReason) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus(status);
        if (status == BookingStatus.REJECTED) {
            booking.setRejectionReason(rejectionReason);
        }

        if (status == BookingStatus.APPROVED) {
            // Check for existing APPROVED conflicts first
            List<Booking> activeConflicts = bookingRepository.findOverlappingActiveBookings(
                    booking.getResourceId(), booking.getDate(), booking.getStartTime(), booking.getEndTime());
            
            boolean hasApprovedConflict = activeConflicts.stream()
                    .anyMatch(c -> c.getStatus() == BookingStatus.APPROVED && !c.getId().equals(bookingId));
            
            if (hasApprovedConflict) {
                throw new BookingConflictException("Cannot approve this booking because another booking is already approved for this time slot.");
            }

            // Auto-reject other PENDING bookings that overlap
            List<Booking> toAutoReject = activeConflicts.stream()
                    .filter(c -> c.getStatus() == BookingStatus.PENDING && !c.getId().equals(bookingId))
                    .collect(Collectors.toList());
            
            for (Booking pending : toAutoReject) {
                pending.setStatus(BookingStatus.REJECTED);
                pending.setRejectionReason("The resource has been booked by another user for this time slot.");
                bookingRepository.save(pending);
                
                // Notify the auto-rejected user
                Resource resource = resourceRepository.findById(pending.getResourceId()).orElse(null);
                String resName = resource != null ? resource.getName() : "a resource";
                notificationService.createNotification(
                        pending.getUserId(),
                        "Booking Automatically Declined",
                        "Your booking request for \"" + resName + "\" was automatically declined because the time slot was approved for another user.",
                        NotificationType.BOOKING_REJECTED,
                        pending.getId(),
                        null, null, null, "System"
                );
            }
        }

        Booking updatedBooking = bookingRepository.save(booking);

        // Notify the booking owner of the status change
        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        String resourceName = resource != null ? resource.getName() : "a resource";

        if (status == BookingStatus.APPROVED) {
            notificationService.createNotification(
                    booking.getUserId(),
                    "Booking Approved",
                    "Your booking request for \"" + resourceName + "\" has been approved!",
                    NotificationType.BOOKING_APPROVED,
                    bookingId,
                    null, null, null, "Booking Owner"
            );
        } else if (status == BookingStatus.REJECTED) {
            String reason = rejectionReason != null && !rejectionReason.isBlank()
                    ? " Reason: " + rejectionReason
                    : "";
            notificationService.createNotification(
                    booking.getUserId(),
                    "Booking Declined",
                    "Your booking request for \"" + resourceName + "\" has been declined." + reason,
                    NotificationType.BOOKING_REJECTED,
                    bookingId,
                    null, null, null, "Booking Owner"
            );
        } else if (status == BookingStatus.CANCELLED) {
            notificationService.createNotification(
                    booking.getUserId(),
                    "Booking Cancelled",
                    "Your booking for \"" + resourceName + "\" has been cancelled by an administrator.",
                    NotificationType.BOOKING_REJECTED, // Using existing type for simplicity
                    bookingId,
                    null, null, null, "System"
            );
        }

        return mapToResponseDTO(updatedBooking);
    }

    @Override
    public BookingResponseDTO cancelBooking(String bookingId, String userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        if (!booking.getUserId().equals(userId)) {
            // Check if user is admin (this check might be better in the controller/security layer, 
            // but for safety we check ownership here or rely on userId passed from secure context)
            throw new RuntimeException("You are not authorized to cancel this booking.");
        }
        
        booking.setStatus(BookingStatus.CANCELLED);
        Booking updatedBooking = bookingRepository.save(booking);
        return mapToResponseDTO(updatedBooking);
    }

    @Override
    public BookingResponseDTO getBookingById(String bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return mapToResponseDTO(booking);
    }

    @Override
    public List<BookingResponseDTO> getResourceBookingsByDate(String resourceId, java.time.LocalDate date) {
        return bookingRepository.findByResourceIdAndDate(resourceId, date).stream()
                .filter(b -> b.getStatus() != BookingStatus.CANCELLED && b.getStatus() != BookingStatus.REJECTED)
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteBooking(String bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new RuntimeException("Booking not found");
        }
        bookingRepository.deleteById(bookingId);
    }

    private BookingResponseDTO mapToResponseDTO(Booking booking) {
        Resource resource = resourceRepository.findById(booking.getResourceId()).orElse(null);
        User user = userRepository.findById(booking.getUserId()).orElse(null);

        return BookingResponseDTO.builder()
                .id(booking.getId())
                .resourceId(booking.getResourceId())
                .resourceName(resource != null ? resource.getName() : "Unknown Resource")
                .userId(booking.getUserId())
                .userName(user != null ? user.getName() : "Unknown User")
                .date(booking.getDate())
                .startTime(booking.getStartTime())
                .endTime(booking.getEndTime())
                .purpose(booking.getPurpose())
                .attendees(booking.getAttendees())
                .resourceType(resource != null ? resource.getType() : null)
                .status(booking.getStatus())
                .rejectionReason(booking.getRejectionReason())
                .createdAt(booking.getCreatedAt())
                .build();
    }
}
