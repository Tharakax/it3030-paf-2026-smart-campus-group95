package com.unisync.service;

import com.unisync.dto.IncidentTicketRequestDTO;
import com.unisync.dto.IncidentTicketResponseDTO;
import com.unisync.dto.StatusUpdateDTO;
import com.unisync.entity.IncidentTicket;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.enums.TicketStatus;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.exception.UnauthorizedException;
import com.unisync.repository.IncidentTicketRepository;
import com.unisync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;

    public IncidentTicketResponseDTO createTicket(IncidentTicketRequestDTO request, User currentUser) {
        IncidentTicket ticket = IncidentTicket.builder()
                .resourceId(request.getResourceId())
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .status(TicketStatus.OPEN)
                .createdBy(currentUser.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        IncidentTicket savedTicket = ticketRepository.save(ticket);
        return convertToResponseDTO(savedTicket);
    }

    public List<IncidentTicketResponseDTO> getAllTickets(User currentUser) {
        List<IncidentTicket> tickets;

        if (currentUser.getRole() == Role.ADMIN) {
            tickets = ticketRepository.findAll();
        } else if (currentUser.getRole() == Role.TECHNICIAN) {
            // Technicians see tickets assigned to them or unassigned OPEN tickets?
            // For now, let's say all tickets for staff, or maybe only assigned + unassigned.
            // Let's go with all for technicians for now so they can pick up work.
            tickets = ticketRepository.findAll();
        } else {
            tickets = ticketRepository.findByCreatedBy(currentUser.getId());
        }

        return tickets.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    public IncidentTicketResponseDTO getTicketById(String id, User currentUser) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        // Security check: User can only see their own tickets
        if (currentUser.getRole() == Role.USER && !ticket.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to view this ticket");
        }

        return convertToResponseDTO(ticket);
    }

    public IncidentTicketResponseDTO updateStatus(String id, StatusUpdateDTO update, User currentUser) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        TicketStatus newStatus = update.getStatus();

        // Role-based transition logic
        if (currentUser.getRole() == Role.USER) {
            if (newStatus == TicketStatus.CLOSED && ticket.getStatus() == TicketStatus.RESOLVED) {
                ticket.setStatus(TicketStatus.CLOSED);
            } else {
                throw new UnauthorizedException("Users can only close resolved tickets");
            }
        } else if (currentUser.getRole() == Role.TECHNICIAN) {
            if (newStatus == TicketStatus.IN_PROGRESS || newStatus == TicketStatus.RESOLVED) {
                ticket.setStatus(newStatus);
                if (newStatus == TicketStatus.RESOLVED) {
                    ticket.setResolutionNotes(update.getNotes());
                }
            } else {
                throw new UnauthorizedException("Technicians can only mark tickets as IN_PROGRESS or RESOLVED");
            }
        } else if (currentUser.getRole() == Role.ADMIN) {
            ticket.setStatus(newStatus);
            if (newStatus == TicketStatus.REJECTED) {
                ticket.setRejectionReason(update.getNotes());
            } else if (newStatus == TicketStatus.RESOLVED) {
                ticket.setResolutionNotes(update.getNotes());
            }
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        return convertToResponseDTO(ticketRepository.save(ticket));
    }

    public IncidentTicketResponseDTO assignTechnician(String id, String technicianId, User currentUser) {
        if (currentUser.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only admins can assign technicians");
        }

        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + technicianId));

        if (technician.getRole() != Role.TECHNICIAN) {
            throw new IllegalArgumentException("User is not a technician");
        }

        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return convertToResponseDTO(ticketRepository.save(ticket));
    }

    private IncidentTicketResponseDTO convertToResponseDTO(IncidentTicket ticket) {
        String createdByName = userRepository.findById(ticket.getCreatedBy())
                .map(User::getName).orElse("Unknown");
        String assignedToName = ticket.getAssignedTo() != null ?
                userRepository.findById(ticket.getAssignedTo()).map(User::getName).orElse("Unknown") : null;

        return IncidentTicketResponseDTO.builder()
                .id(ticket.getId())
                .resourceId(ticket.getResourceId())
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .contactDetails(ticket.getContactDetails())
                .status(ticket.getStatus())
                .createdBy(ticket.getCreatedBy())
                .createdByName(createdByName)
                .assignedTo(ticket.getAssignedTo())
                .assignedToName(assignedToName)
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionNotes())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
