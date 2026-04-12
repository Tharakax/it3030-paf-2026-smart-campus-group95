package com.unisync.dto;

import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicketRequestDTO {
    private String resourceId;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String contactDetails;
}
