package com.unisync.controller;

import com.unisync.dto.DashboardActivityDTO;
import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.Booking;
import com.unisync.entity.IncidentTicket;
import com.unisync.entity.Resource;
import com.unisync.entity.Role;
import com.unisync.enums.BookingStatus;
import com.unisync.enums.TicketStatus;
import com.unisync.repository.BookingRepository;
import com.unisync.repository.IncidentTicketRepository;
import com.unisync.repository.ResourceRepository;
import com.unisync.repository.UserRepository;
import com.unisync.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.unisync.service.UserService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final IncidentTicketRepository incidentTicketRepository;
    private final ResourceRepository resourceRepository;

    @GetMapping("/lookup")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<UserProfileDTO>> lookupUsers(@org.springframework.web.bind.annotation.RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getUserDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }
        
        String userId = userPrincipal.getId();
        
        long activeBookings = bookingRepository.countByUserIdAndStatusIn(
            userId, 
            List.of(BookingStatus.APPROVED, BookingStatus.PENDING)
        );
        
        long openTickets = incidentTicketRepository.countByCreatedByAndStatusIn(
            userId, 
            List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
        );

        // Fetch recent activities
        List<Booking> recentBookings = bookingRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
        List<IncidentTicket> recentTickets = incidentTicketRepository.findTop5ByCreatedByOrderByCreatedAtDesc(userId);

        List<DashboardActivityDTO> activities = new ArrayList<>();

        for (Booking b : recentBookings) {
            String resourceName = resourceRepository.findById(b.getResourceId())
                .map(Resource::getName)
                .orElse("Resource");
            
            LocalDateTime timestamp = b.getCreatedAt();
            if (timestamp == null && b.getDate() != null) {
                timestamp = b.getDate().atStartOfDay();
            }
            if (timestamp == null) timestamp = LocalDateTime.now().minusHours(1);

            activities.add(DashboardActivityDTO.builder()
                .title("Reserved: " + resourceName)
                .type("booking")
                .status(b.getStatus() == BookingStatus.APPROVED ? "success" : "pending")
                .timestamp(timestamp)
                .build());
        }

        for (IncidentTicket t : recentTickets) {
            String resourceName = resourceRepository.findById(t.getResourceId())
                .map(Resource::getName)
                .orElse("Resource");
            
            String categoryLabel = t.getCategory() != null ? t.getCategory().name() : "Incident";
            
            activities.add(DashboardActivityDTO.builder()
                .title(categoryLabel + " Reported: " + resourceName)
                .type("ticket")
                .status(t.getStatus() == TicketStatus.RESOLVED || t.getStatus() == TicketStatus.CLOSED ? "success" : "pending")
                .timestamp(t.getCreatedAt() != null ? t.getCreatedAt() : LocalDateTime.now().minusHours(2))
                .build());
        }

        // Sort by timestamp descending and take top 5
        activities.sort((a, b1) -> b1.getTimestamp().compareTo(a.getTimestamp()));
        List<DashboardActivityDTO> recentActivities = activities.stream().limit(5).collect(Collectors.toList());
        
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to the User Dashboard!",
            "activeBookings", activeBookings,
            "openTickets", openTickets,
            "recentActivities", recentActivities
        ));
    }

    @GetMapping("/technicians")
    public ResponseEntity<List<UserProfileDTO>> getAllTechnicians() {
        List<UserProfileDTO> technicians = userRepository.findByRole(Role.TECHNICIAN).stream()
                .map(user -> UserProfileDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .profilePictureUrl(user.getProfilePictureUrl())
                        .role(user.getRole())
                        .specialization(user.getSpecialization())
                        .build())
                .collect(Collectors.toList());
        return ResponseEntity.ok(technicians);
    }
}
