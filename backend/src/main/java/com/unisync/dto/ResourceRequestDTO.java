package com.unisync.dto;

import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResourceRequestDTO {
    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    @NotNull(message = "Resource type is required")
    private ResourceType type;

    @NotNull(message = "Capacity is required")
    @Min(value = 0, message = "Capacity must be zero or greater")
    private Integer capacity;

    private Department department;

    @NotNull(message = "Availability start time is required")
    private LocalTime availabilityStartTime;

    @NotNull(message = "Availability end time is required")
    private LocalTime availabilityEndTime;

    @NotNull(message = "Resource status is required")
    private ResourceStatus status;

    private boolean bookable;
}
