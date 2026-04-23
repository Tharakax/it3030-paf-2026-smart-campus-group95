package com.unisync.dto;

import com.unisync.enums.Department;
import com.unisync.enums.ResourceType;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ResourceAnalyticsSummaryDTO {
    private long totalResources;
    private long activeResources;
    private long outOfServiceResources;
    private long bookableResources;
    private long nonBookableResources;
    private double imageCoveragePercentage;
    private Map<ResourceType, Long> resourcesByType;
    private Map<Department, Long> resourcesByDepartment;
}
