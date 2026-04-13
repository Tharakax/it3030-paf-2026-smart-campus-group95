package com.unisync.service.impl;

import com.unisync.entity.Resource;
import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import com.unisync.repository.ResourceRepository;
import com.unisync.service.ResourceService;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository resourceRepository;
    private final MongoTemplate mongoTemplate;

    public ResourceServiceImpl(ResourceRepository resourceRepository, MongoTemplate mongoTemplate) {
        this.resourceRepository = resourceRepository;
        this.mongoTemplate = mongoTemplate;
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
    public List<Resource> getResources(ResourceType type, Department department, ResourceStatus status, Boolean bookable) {
        if (type == null && department == null && status == null && bookable == null) {
            return getAllResources();
        }

        Query query = new Query();
        List<Criteria> criteria = new ArrayList<>();

        if (type != null) {
            criteria.add(Criteria.where("type").is(type));
        }
        if (department != null) {
            criteria.add(Criteria.where("department").is(department));
        }
        if (status != null) {
            criteria.add(Criteria.where("status").is(status));
        }
        if (bookable != null) {
            criteria.add(Criteria.where("bookable").is(bookable));
        }

        if (!criteria.isEmpty()) {
            query.addCriteria(new Criteria().andOperator(criteria.toArray(new Criteria[0])));
        }

        return mongoTemplate.find(query, Resource.class);
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
