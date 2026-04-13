package com.unisync.controller;

import com.unisync.dto.ResourceRequestDTO;
import com.unisync.dto.ResourceResponseDTO;
import com.unisync.entity.Resource;
import com.unisync.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
public class ResourceController {

    private final ResourceService resourceService;

    @PostMapping
    public ResponseEntity<ResourceResponseDTO> createResource(@RequestBody ResourceRequestDTO requestDTO) {
        Resource resource = mapToEntity(requestDTO);
        Resource savedResource = resourceService.createResource(resource);
        return new ResponseEntity<>(mapToResponseDTO(savedResource), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<ResourceResponseDTO>> getAllResources() {
        List<ResourceResponseDTO> resources = resourceService.getAllResources().stream()
                .map(this::mapToResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> getResourceById(@PathVariable String id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(mapToResponseDTO(resource));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceResponseDTO> updateResource(@PathVariable String id, @RequestBody ResourceRequestDTO requestDTO) {
        Resource resource = mapToEntity(requestDTO);
        Resource updatedResource = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(mapToResponseDTO(updatedResource));
    }

    @DeleteMapping("/{id}")
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
