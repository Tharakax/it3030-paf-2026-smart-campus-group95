package com.unisync.controller;

import com.unisync.dto.ResourceRequestDTO;
import com.unisync.dto.ResourceResponseDTO;
import com.unisync.entity.Resource;
import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import com.unisync.service.ResourceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> createResource(@Valid @RequestBody ResourceRequestDTO requestDTO) {
        Resource resource = mapToEntity(requestDTO);
        Resource savedResource = resourceService.createResource(resource);
        return new ResponseEntity<>(mapToResponseDTO(savedResource), HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources(
            @RequestParam(required = false) ResourceType type,
            @RequestParam(required = false) Department department,
            @RequestParam(required = false) ResourceStatus status,
            @RequestParam(required = false) Boolean bookable) {
        
        List<ResourceResponseDTO> resources = resourceService.getResources(type, department, status, bookable).stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(mapToResponseDTO(resource));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ResourceResponseDTO> updateResource(@PathVariable String id, @Valid @RequestBody ResourceRequestDTO requestDTO) {
        Resource resource = mapToEntity(requestDTO);
        Resource updatedResource = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(mapToResponseDTO(updatedResource));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    private Resource mapToEntity(ResourceRequestDTO dto) {
        return Resource.builder()
                .resourceCode(dto.getResourceCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .department(dto.getDepartment())
                .availabilityStartTime(dto.getAvailabilityStartTime())
                .availabilityEndTime(dto.getAvailabilityEndTime())
                .status(dto.getStatus())
                .bookable(dto.isBookable())
                .build();
    }

    private ResourceResponseDTO mapToResponseDTO(Resource resource) {
        return ResourceResponseDTO.builder()
                .id(resource.getId())
                .resourceCode(resource.getResourceCode())
                .name(resource.getName())
                .description(resource.getDescription())
                .type(resource.getType())
                .capacity(resource.getCapacity())
                .department(resource.getDepartment())
                .availabilityStartTime(resource.getAvailabilityStartTime())
                .availabilityEndTime(resource.getAvailabilityEndTime())
                .status(resource.getStatus())
                .bookable(resource.isBookable())
                .build();
    }
}
