package com.unisync.service.impl;

import com.unisync.dto.BookingRequestDTO;
import com.unisync.dto.BookingResponseDTO;
import com.unisync.entity.Booking;
import com.unisync.entity.Resource;
import com.unisync.entity.User;
import com.unisync.enums.BookingStatus;
import com.unisync.exception.BookingConflictException;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.repository.BookingRepository;
import com.unisync.repository.ResourceRepository;
import com.unisync.repository.UserRepository;
import com.unisync.service.BookingService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final UserRepository userRepository;

    public BookingServiceImpl(BookingRepository bookingRepository, 
                              ResourceRepository resourceRepository, 
                              UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.userRepository = userRepository;
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

        // Check for conflicts (Overlapping Approved or Pending bookings)
        List<Booking> conflicts = bookingRepository.findOverlappingActiveBookings(
                request.getResourceId(), request.getDate(), request.getStartTime(), request.getEndTime());
        
        if (!conflicts.isEmpty()) {
            throw new BookingConflictException("The resource is already booked for the selected time range.");
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
        
        Booking updatedBooking = bookingRepository.save(booking);
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
