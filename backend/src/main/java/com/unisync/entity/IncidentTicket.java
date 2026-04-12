package com.unisync.entity;

import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import com.unisync.enums.TicketStatus;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "incident_tickets")
public class IncidentTicket {

    @Id
    private String id;

    private String resourceId;

    private TicketCategory category;

    private String description;

    private TicketPriority priority;

    private String contactDetails;

    private TicketStatus status;

    private String createdBy; // User ID

    private String assignedTo; // User ID (Technician)

    private String rejectionReason;

    private String resolutionNotes;

    private List<String> imageUrls;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
