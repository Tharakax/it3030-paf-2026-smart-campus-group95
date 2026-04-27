package com.unisync.controller;

import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.User;
import com.unisync.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.unisync.dto.AuthResponse;
import com.unisync.dto.LoginRequest;
import com.unisync.dto.SignupRequest;
import com.unisync.service.AuthService;
import com.unisync.service.LoginLogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final LoginLogService loginLogService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> registerUser(@Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(authService.register(signupRequest));
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileDTO> getCurrentUser(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userPrincipal.getUser();
        UserProfileDTO userProfileDTO = UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .contactNumber(user.getContactNumber())
                .notificationsEnabled(user.isNotificationsEnabled())
                .build();
 
         return ResponseEntity.ok(userProfileDTO);
     }
 
     @org.springframework.web.bind.annotation.PutMapping("/me")
     public ResponseEntity<UserProfileDTO> updateCurrentUser(
             @AuthenticationPrincipal UserPrincipal userPrincipal,
             @Valid @RequestBody UserProfileDTO profileUpdate) {
         if (userPrincipal == null) {
             return ResponseEntity.status(401).build();
         }
         
         // Only allow updating name and contact number for now
         UserProfileDTO update = UserProfileDTO.builder()
                 .name(profileUpdate.getName())
                 .contactNumber(profileUpdate.getContactNumber())
                 .notificationsEnabled(profileUpdate.isNotificationsEnabled())
                 .build();
                 
         return ResponseEntity.ok(authService.updateProfile(userPrincipal.getId(), update));
     }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        if (userPrincipal != null) {
            loginLogService.logLogout(userPrincipal.getUser());
        }
        return ResponseEntity.ok().build();
    }
 }
