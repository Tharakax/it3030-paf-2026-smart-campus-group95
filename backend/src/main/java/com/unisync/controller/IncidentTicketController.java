package com.unisync.controller;

import com.unisync.dto.IncidentTicketRequestDTO;
import com.unisync.dto.IncidentTicketResponseDTO;
import com.unisync.dto.StatusUpdateDTO;
import com.unisync.security.UserPrincipal;
import com.unisync.service.IncidentTicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    @PostMapping
    public ResponseEntity<IncidentTicketResponseDTO> createTicket(
            @RequestBody IncidentTicketRequestDTO request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ticketService.createTicket(request, userPrincipal.getUser()));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicketResponseDTO>> getAllTickets(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ticketService.getAllTickets(userPrincipal.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicketResponseDTO> getTicketById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ticketService.getTicketById(id, userPrincipal.getUser()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicketResponseDTO> updateStatus(
            @PathVariable String id,
            @RequestBody StatusUpdateDTO update,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ticketService.updateStatus(id, update, userPrincipal.getUser()));
    }

    @PutMapping("/{id}/assign/{technicianId}")
    public ResponseEntity<IncidentTicketResponseDTO> assignTechnician(
            @PathVariable String id,
            @PathVariable String technicianId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId, userPrincipal.getUser()));
    }
}
