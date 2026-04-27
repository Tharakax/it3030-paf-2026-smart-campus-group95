package com.unisync.dto;

import com.unisync.entity.ResolutionRecord;
import com.unisync.enums.Department;
import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import com.unisync.enums.TicketStatus;
import com.unisync.enums.ResourceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentTicketResponseDTO {
    private String id;
    private String ticketId;
    private String resourceId;
    private String resourceName;
    private ResourceType resourceType;
    private Department department;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String contactDetails;
    private TicketStatus status;
    private String createdBy;
    private String createdByName;
    private String createdByEmail;
    private String assignedTo;
    private String assignedToName;
    private String rejectionReason;
    private ResolutionRecord resolutionNotes;
    private List<String> imageUrls;
    private LocalDateTime firstResponseAt;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
