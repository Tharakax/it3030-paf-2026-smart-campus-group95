package com.unisync.dto;

import com.unisync.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private String id;
    private String email;
    private String name;
    private String profilePictureUrl;
    private Role role;
}
