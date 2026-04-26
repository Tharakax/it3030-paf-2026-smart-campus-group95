package com.unisync.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardActivityDTO {
    private String title;
    private String type; // "booking", "ticket"
    private String status; // "success", "pending", "info", "warning"
    private LocalDateTime timestamp;
}
