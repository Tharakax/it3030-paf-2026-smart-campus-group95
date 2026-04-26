package com.unisync.controller;

import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.Role;
import com.unisync.enums.BookingStatus;
import com.unisync.enums.TicketStatus;
import com.unisync.repository.BookingRepository;
import com.unisync.repository.IncidentTicketRepository;
import com.unisync.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.unisync.service.UserService;

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
        
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to the User Dashboard!",
            "activeBookings", activeBookings,
            "openTickets", openTickets
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
