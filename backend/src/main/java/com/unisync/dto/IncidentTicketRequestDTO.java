package com.unisync.dto;

import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicketRequestDTO {
    private String resourceId;
    private TicketCategory category;
    private String description;
    private TicketPriority priority;
    private String contactDetails;
    @JsonProperty("imageUrls")
    private List<String> imageUrls;
}
