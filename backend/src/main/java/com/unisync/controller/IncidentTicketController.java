package com.unisync.controller;

import com.unisync.dto.IncidentTicketRequestDTO;
import com.unisync.dto.IncidentTicketResponseDTO;
import com.unisync.dto.StatusUpdateDTO;
import com.unisync.security.UserPrincipal;
import com.unisync.service.IncidentTicketService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
@RequiredArgsConstructor
public class IncidentTicketController {

    private final IncidentTicketService ticketService;

    @PostMapping
    public ResponseEntity<IncidentTicketResponseDTO> createTicket(
            @Valid @RequestBody IncidentTicketRequestDTO request,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ticketService.createTicket(request, principal.getUser()));
    }

    @GetMapping
    public ResponseEntity<List<IncidentTicketResponseDTO>> getAllTickets(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ticketService.getAllTickets(principal.getUser()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<IncidentTicketResponseDTO> getTicketById(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ticketService.getTicketById(id, principal.getUser()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<IncidentTicketResponseDTO> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody StatusUpdateDTO update,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ticketService.updateStatus(id, update, principal.getUser()));
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<IncidentTicketResponseDTO> assignTechnician(
            @PathVariable String id,
            @RequestBody Map<String, String> assignment,
            @AuthenticationPrincipal UserPrincipal principal) {
        String technicianId = assignment.get("technicianId");
        return ResponseEntity.ok(ticketService.assignTechnician(id, technicianId, principal.getUser()));
    }
}
