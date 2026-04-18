package com.unisync.controller;

import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.Role;
import com.unisync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
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

    @GetMapping("/lookup")
    @PreAuthorize("hasAnyRole('ADMIN', 'TECHNICIAN')")
    public ResponseEntity<List<UserProfileDTO>> lookupUsers(@org.springframework.web.bind.annotation.RequestParam(required = false) Role role) {
        if (role != null) {
            return ResponseEntity.ok(userService.getUsersByRole(role));
        }
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getUserDashboard() {
        return ResponseEntity.ok(Map.of("message", "Welcome to the User Dashboard!"));
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
