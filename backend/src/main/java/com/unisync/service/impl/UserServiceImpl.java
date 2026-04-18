package com.unisync.service.impl;

import com.unisync.dto.TechnicianCreateRequest;
import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.repository.UserRepository;
import com.unisync.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserProfileDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UserProfileDTO updateUser(String id, UserProfileDTO userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update fields
        user.setRole(userDetails.getRole());
        user.setSpecialization(userDetails.getSpecialization());
        
        // Note: Name and Email might also be updated if specifically requested, 
        // but typically role and specialization are the main administrative changes.
        if (userDetails.getName() != null) user.setName(userDetails.getName());

        User updatedUser = userRepository.save(user);
        return convertToDTO(updatedUser);
    }

    @Override
    public void deleteUser(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserProfileDTO createTechnician(TechnicianCreateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email address already in use.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.TECHNICIAN)
                .specialization(request.getSpecialization())
                .build();

        User savedUser = userRepository.save(user);
        return convertToDTO(savedUser);
    }

    private UserProfileDTO convertToDTO(User user) {
        return UserProfileDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .profilePictureUrl(user.getProfilePictureUrl())
                .role(user.getRole())
                .specialization(user.getSpecialization())
                .build();
    }
}
