package com.unisync.service.impl;

import com.unisync.dto.UserProfileDTO;
import com.unisync.entity.User;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.repository.UserRepository;
import com.unisync.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

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
