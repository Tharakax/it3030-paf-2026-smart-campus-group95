package com.unisync.entity;

import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalTime;

/**
 * Entity representing a campus resource in the Facilities & Assets Catalogue.
 * Uses MongoDB for persistence.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String name;

    private ResourceType type;

    private Integer capacity;

    private String location;

    private LocalTime availableFrom;

    private LocalTime availableTo;

    private ResourceStatus status;

    private String description;
}
