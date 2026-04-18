package com.unisync.service;

import com.unisync.dto.UserProfileDTO;
import java.util.List;

public interface UserService {
    List<UserProfileDTO> getAllUsers();
    UserProfileDTO updateUser(String id, UserProfileDTO userDetails);
    void deleteUser(String id);
}
