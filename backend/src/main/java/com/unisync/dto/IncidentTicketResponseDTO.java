package com.unisync.dto;

import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import com.unisync.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentTicketResponseDTO {
    private String id;
    private String resourceId;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String contactDetails;
    private TicketStatus status;
    private String createdBy;
    private String createdByName;
    private String assignedTo;
    private String assignedToName;
    private String rejectionReason;
    private String resolutionNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
