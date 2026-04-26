package com.unisync.service;

import com.unisync.dto.AuthResponse;
import com.unisync.dto.LoginRequest;
import com.unisync.dto.SignupRequest;
import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.repository.UserRepository;
import com.unisync.security.JwtUtil;
import com.unisync.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address already in use.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER) // Default role for manual registration
                .build();

        user = userRepository.save(user);

        // Auto-login after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(authentication);
        return AuthResponse.builder()
                .token(token)
                .user(convertToDTO(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();
        String token = jwtUtil.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .user(convertToDTO(user))
                .build();
    }

    @Transactional
    public UserProfileDTO updateProfile(String userId, UserProfileDTO update) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (update.getName() != null) user.setName(update.getName());
        if (update.getContactNumber() != null) user.setContactNumber(update.getContactNumber());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    private UserProfileDTO convertToDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .contactNumber(user.getContactNumber())
                .build();
    }
}
