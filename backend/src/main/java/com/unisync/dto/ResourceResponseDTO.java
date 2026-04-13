package com.unisync.dto;

import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceResponseDTO {
    private String id;
    private String resourceCode;
    private String name;
    private String description;
    private ResourceType type;
    private Integer capacity;
    private Department department;
    private LocalTime availabilityStartTime;
    private LocalTime availabilityEndTime;
    private ResourceStatus status;
    private boolean bookable;
}
