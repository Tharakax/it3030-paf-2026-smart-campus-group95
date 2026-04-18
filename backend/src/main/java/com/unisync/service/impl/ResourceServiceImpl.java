package com.unisync.service.impl;

import com.unisync.dto.ResourceAnalyticsSummaryDTO;
import com.unisync.entity.Resource;
import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import com.unisync.exception.DuplicateResourceCodeException;
import com.unisync.exception.InvalidResourceAvailabilityException;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.repository.ResourceRepository;
import com.unisync.service.ResourceService;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

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
        validateAvailabilityTimes(resource);

        // Force capacity to 1 if type is EQUIPMENT
        if (resource.getType() == ResourceType.EQUIPMENT) {
            resource.setCapacity(1);
        }
        
        // Auto-generate resourceCode
        String prefix = getPrefixForType(resource.getType());
        long nextSequence = getNextSequenceForType(resource.getType(), prefix);
        String generatedCode = String.format("%s-%03d", prefix, nextSequence);
        
        resource.setResourceCode(generatedCode);
        
        // Final safety check for uniqueness (shouldn't be needed with proper sequence, but good for concurrency)
        if (resourceRepository.existsByResourceCode(resource.getResourceCode())) {
            throw new DuplicateResourceCodeException("Resource with generated code " + resource.getResourceCode() + " already exists.");
        }
        
        return resourceRepository.save(resource);
    }

    private String getPrefixForType(ResourceType type) {
        return switch (type) {
            case LECTURE_HALL -> "LH";
            case LAB -> "LAB";
            case MEETING_ROOM -> "MR";
            case AUDITORIUM -> "AUD";
            case STUDY_ROOM -> "SR";
            case GROUND -> "GRD";
            case EQUIPMENT -> "EQ";
            default -> "RES";
        };
    }

    private long getNextSequenceForType(ResourceType type, String prefix) {
        Query query = new Query(Criteria.where("type").is(type))
                .with(Sort.by(Sort.Direction.DESC, "resourceCode"))
                .limit(1);
        
        Resource lastResource = mongoTemplate.findOne(query, Resource.class);
        
        if (lastResource == null || lastResource.getResourceCode() == null) {
            return 1;
        }

        String lastCode = lastResource.getResourceCode();
        try {
            int dashIndex = lastCode.lastIndexOf("-");
            if (dashIndex != -1) {
                String suffix = lastCode.substring(dashIndex + 1);
                return Long.parseLong(suffix) + 1;
            }
            return resourceRepository.countByType(type) + 1;
        } catch (Exception e) {
            // Fallback if existing codes don't follow pattern strictly
            return resourceRepository.countByType(type) + 1;
        }
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
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    @Override
    public Resource updateResource(String id, Resource resource) {
        validateAvailabilityTimes(resource);
        Resource existingResource = getResourceById(id);
        
        // resourceCode must remain unchanged on update
        // existingResource.setResourceCode(resource.getResourceCode()); 
        
        existingResource.setName(resource.getName());
        existingResource.setDescription(resource.getDescription());
        existingResource.setType(resource.getType());
        
        // Force capacity to 1 if type is EQUIPMENT
        if (resource.getType() == ResourceType.EQUIPMENT) {
            existingResource.setCapacity(1);
        } else {
            existingResource.setCapacity(resource.getCapacity());
        }
        
        existingResource.setDepartment(resource.getDepartment());
        existingResource.setAvailabilityStartTime(resource.getAvailabilityStartTime());
        existingResource.setAvailabilityEndTime(resource.getAvailabilityEndTime());
        existingResource.setStatus(resource.getStatus());
        existingResource.setBookable(resource.isBookable());
        existingResource.setImageUrls(resource.getImageUrls());

        return resourceRepository.save(existingResource);
    }
private void validateAvailabilityTimes(Resource resource) {
        if (resource.getAvailabilityStartTime() != null && resource.getAvailabilityEndTime() != null) {
            if (!resource.getAvailabilityEndTime().isAfter(resource.getAvailabilityStartTime())) {
                throw new InvalidResourceAvailabilityException("Availability end time must be after start time.");
            }
        }
    }

    
    @Override
    public void deleteResource(String id) {
        if (!resourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resource not found with id: " + id);
        }
        resourceRepository.deleteById(id);
    }

    @Override
    public ResourceAnalyticsSummaryDTO getResourceAnalyticsSummary() {
        List<Resource> allResources = resourceRepository.findAll();
        
        long totalResources = allResources.size();
        long activeResources = allResources.stream()
                .filter(r -> r.getStatus() == ResourceStatus.ACTIVE)
                .count();
        long outOfServiceResources = allResources.stream()
                .filter(r -> r.getStatus() == ResourceStatus.OUT_OF_SERVICE)
                .count();
        long bookableResources = allResources.stream()
                .filter(Resource::isBookable)
                .count();
        long nonBookableResources = totalResources - bookableResources;
        
        long resourcesWithImages = allResources.stream()
                .filter(r -> r.getImageUrls() != null && !r.getImageUrls().isEmpty())
                .count();
        double imageCoveragePercentage = totalResources > 0 ? (double) resourcesWithImages / totalResources * 100 : 0;
        
        Map<ResourceType, Long> resourcesByType = allResources.stream()
                .collect(Collectors.groupingBy(Resource::getType, Collectors.counting()));
        
        Map<Department, Long> resourcesByDepartment = allResources.stream()
                .filter(r -> r.getDepartment() != null)
                .collect(Collectors.groupingBy(Resource::getDepartment, Collectors.counting()));
        
        return ResourceAnalyticsSummaryDTO.builder()
                .totalResources(totalResources)
                .activeResources(activeResources)
                .outOfServiceResources(outOfServiceResources)
                .bookableResources(bookableResources)
                .nonBookableResources(nonBookableResources)
                .imageCoveragePercentage(imageCoveragePercentage)
                .resourcesByType(resourcesByType)
                .resourcesByDepartment(resourcesByDepartment)
                .build();
    }
}
