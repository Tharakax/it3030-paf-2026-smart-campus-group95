package com.unisync.service;

import com.unisync.dto.ResourceAnalyticsSummaryDTO;
import com.unisync.entity.Resource;
import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;

import java.util.List;

public interface ResourceService {
    Resource createResource(Resource resource);
    List<Resource> getAllResources();
    List<Resource> getResources(ResourceType type, Department department, ResourceStatus status, Boolean bookable);
    Resource getResourceById(String id);
    Resource updateResource(String id, Resource resource);
    void deleteResource(String id);
    ResourceAnalyticsSummaryDTO getResourceAnalyticsSummary();
}
