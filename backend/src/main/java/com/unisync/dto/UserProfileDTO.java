package com.unisync.dto;

import com.unisync.entity.Role;
import com.unisync.enums.TicketCategory;
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
    private TicketCategory specialization;
    private String contactNumber;
    private boolean notificationsEnabled;
}
