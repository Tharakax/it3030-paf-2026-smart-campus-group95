package com.unisync.service.impl;

import com.unisync.entity.Resource;
import com.unisync.repository.ResourceRepository;
import com.unisync.service.ResourceService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;

    public ResourceServiceImpl(ResourceRepository resourceRepository) {
        this.resourceRepository = resourceRepository;
    }

    @Override
    public Resource createResource(Resource resource) {
        if (resourceRepository.existsByResourceCode(resource.getResourceCode())) {
            throw new RuntimeException("Resource with code " + resource.getResourceCode() + " already exists.");
        }
        return resourceRepository.save(resource);
    }

    @Override
    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    @Override
    public Resource getResourceById(String id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, Resource resource) {
        Resource existingResource = getResourceById(id);
        
        // Check if updating resourceCode and if the new code already exists
        if (!existingResource.getResourceCode().equals(resource.getResourceCode()) && 
            resourceRepository.existsByResourceCode(resource.getResourceCode())) {
            throw new RuntimeException("Resource with code " + resource.getResourceCode() + " already exists.");
        }

        existingResource.setResourceCode(resource.getResourceCode());
        existingResource.setName(resource.getName());
        existingResource.setDescription(resource.getDescription());
        existingResource.setType(resource.getType());
        existingResource.setCapacity(resource.getCapacity());
        existingResource.setDepartment(resource.getDepartment());
        existingResource.setAvailabilityStartTime(resource.getAvailabilityStartTime());
        existingResource.setAvailabilityEndTime(resource.getAvailabilityEndTime());
        existingResource.setStatus(resource.getStatus());
        existingResource.setBookable(resource.isBookable());

        return resourceRepository.save(existingResource);
    }

    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new RuntimeException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }
}
