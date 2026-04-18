package com.unisync.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomNotificationRequest {

    public enum TargetType {
        ALL_USERS,
        ALL_TECHNICIANS,
        SPECIFIC_USER,
        SPECIFIC_TECHNICIAN
    }

    @NotNull(message = "Target type is required")
    private TargetType targetType;

    /** Required only when targetType is SPECIFIC_USER or SPECIFIC_TECHNICIAN */
    private String targetId;

    @NotBlank(message = "Title is required")
    @Size(max = 80, message = "Title must be under 80 characters")
    private String title;

    @NotBlank(message = "Message is required")
    @Size(max = 500, message = "Message must be under 500 characters")
    private String message;
}
