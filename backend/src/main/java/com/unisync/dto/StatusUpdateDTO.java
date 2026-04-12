package com.unisync.dto;

import com.unisync.enums.TicketStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {
    private TicketStatus status;
    private String notes; // Can be rejection reason or resolution notes
}
