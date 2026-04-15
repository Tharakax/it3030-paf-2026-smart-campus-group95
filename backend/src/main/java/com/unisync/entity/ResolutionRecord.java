package com.unisync.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResolutionRecord {
    private String issueIdentified;
    private String actionTaken;
    private LocalDateTime resolvedAt;
}
