package com.unisync.dto;
import com.unisync.enums.TicketCategory;
import com.unisync.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentTicketRequestDTO {
    @NotBlank(message = "Resource ID is required")
    private String resourceId;
    @NotNull(message = "Category is required")
    private TicketCategory category;
    @NotBlank(message = "Description is required")
    private String description;
    @NotNull(message = "Priority is required")
    private TicketPriority priority;
    @NotBlank(message = "Contact details are required")
    private String contactDetails;
    @JsonProperty("imageUrls")
    @Size(max = 3, message = "Maximum 3 images are allowed")
    private List<String> imageUrls;
}
