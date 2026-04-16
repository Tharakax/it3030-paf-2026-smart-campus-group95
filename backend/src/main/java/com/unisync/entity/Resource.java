package com.unisync.entity;

import com.unisync.enums.Department;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.ResourceType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "resources")
public class Resource {

    @Id
    private String id;

    private String resourceCode;

    private String name;

    private String description;

    private ResourceType type;

    private Integer capacity;

    private Department department;

    private LocalTime availabilityStartTime;

    private LocalTime availabilityEndTime;

    private ResourceStatus status;

    private boolean bookable;

    private List<String> imageUrls;
}


