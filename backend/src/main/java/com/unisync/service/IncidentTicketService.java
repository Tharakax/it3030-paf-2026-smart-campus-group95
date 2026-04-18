package com.unisync.service;

import com.unisync.dto.IncidentTicketRequestDTO;
import com.unisync.dto.IncidentTicketResponseDTO;
import com.unisync.dto.StatusUpdateDTO;
import com.unisync.entity.IncidentTicket;
import com.unisync.entity.ResolutionRecord;
import com.unisync.entity.Resource;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.enums.ResourceStatus;
import com.unisync.enums.TicketStatus;
import com.unisync.enums.Department;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.exception.UnauthorizedException;
import com.unisync.exception.DuplicateTicketException;
import com.unisync.repository.IncidentTicketRepository;
import com.unisync.repository.ResourceRepository;
import com.unisync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IncidentTicketService {

    private final IncidentTicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final ResourceRepository resourceRepository;
    private final SequenceGeneratorService sequenceGenerator;

    @Transactional
    public IncidentTicketResponseDTO createTicket(IncidentTicketRequestDTO request, User currentUser) {
        // Validate resource existence
        Resource resource = resourceRepository.findById(request.getResourceId())
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + request.getResourceId()));

        // Prevention Protocol: Detect duplicate active tickets for this user and resource
        boolean hasActiveTicket = ticketRepository.existsByCreatedByAndResourceIdAndStatusIn(
                currentUser.getId(), 
                request.getResourceId(), 
                List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS)
        );

        if (hasActiveTicket) {
            throw new DuplicateTicketException("You have already submitted a ticket for this resource.");
        }

        IncidentTicket ticket = IncidentTicket.builder()
                .ticketId("#TCK" + sequenceGenerator.generateSequence("incident_tickets_sequence"))
                .resourceId(request.getResourceId())
                .category(request.getCategory())
                .description(request.getDescription())
                .priority(request.getPriority())
                .contactDetails(request.getContactDetails())
                .imageUrls(request.getImageUrls())
                .status(TicketStatus.OPEN)
                .createdBy(currentUser.getId())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        // Sync Resource Status: Mark as OUT_OF_SERVICE and not bookable
        resource.setStatus(ResourceStatus.OUT_OF_SERVICE);
        resource.setBookable(false);
        resourceRepository.save(resource);

        IncidentTicket savedTicket = ticketRepository.save(ticket);
        return convertToResponseDTO(savedTicket);
    }

    public List<IncidentTicketResponseDTO> getAllTickets(User currentUser) {
        List<IncidentTicket> tickets;

        if (currentUser.getRole() == Role.ADMIN) {
            tickets = ticketRepository.findAll();
        } else if (currentUser.getRole() == Role.TECHNICIAN) {
            tickets = ticketRepository.findByAssignedTo(currentUser.getId());
        } else {
            tickets = ticketRepository.findByCreatedBy(currentUser.getId());
        }

        return tickets.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    public IncidentTicketResponseDTO getTicketById(String id, User currentUser) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        if (currentUser.getRole() == Role.USER && !ticket.getCreatedBy().equals(currentUser.getId())) {
            throw new UnauthorizedException("You don't have permission to view this ticket");
        }

        if (currentUser.getRole() == Role.TECHNICIAN && (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(currentUser.getId()))) {
            throw new UnauthorizedException("You are not authorized to access this incident report");
        }

        return convertToResponseDTO(ticket);
    }

    @Transactional
    public IncidentTicketResponseDTO updateStatus(String id, StatusUpdateDTO update, User currentUser) {
        IncidentTicket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket not found with id: " + id));

        TicketStatus oldStatus = ticket.getStatus();
        TicketStatus newStatus = update.getStatus();

        // Role-based transition logic
        if (currentUser.getRole() == Role.USER) {
            // Allow closing if already resolved OR if still open and unassigned
            if (newStatus == TicketStatus.CLOSED && 
               (oldStatus == TicketStatus.RESOLVED || (oldStatus == TicketStatus.OPEN && ticket.getAssignedTo() == null))) {
                ticket.setStatus(TicketStatus.CLOSED);
            } else {
                throw new UnauthorizedException("Users can only close resolved tickets or their own unassigned tickets");
            }
        } else if (currentUser.getRole() == Role.TECHNICIAN) {
            if (ticket.getAssignedTo() == null || !ticket.getAssignedTo().equals(currentUser.getId())) {
                throw new UnauthorizedException("You can only update tickets assigned to you");
            }

            if (newStatus == TicketStatus.IN_PROGRESS || newStatus == TicketStatus.RESOLVED) {
                ticket.setStatus(newStatus);
                if (newStatus == TicketStatus.RESOLVED && update.getResolutionNotes() != null) {
                    ResolutionRecord resolution = update.getResolutionNotes();
                    resolution.setResolvedAt(LocalDateTime.now());
                    ticket.setResolutionRecord(resolution);
                }
            } else {
                throw new UnauthorizedException("Technicians can only mark tickets as IN_PROGRESS or RESOLVED");
            }
        } else if (currentUser.getRole() == Role.ADMIN) {
            ticket.setStatus(newStatus);
            if (newStatus == TicketStatus.REJECTED) {
                ticket.setRejectionReason(update.getNotes());
            } else if (newStatus == TicketStatus.RESOLVED && update.getResolutionNotes() != null) {
                ResolutionRecord resolution = update.getResolutionNotes();
                resolution.setResolvedAt(LocalDateTime.now());
                ticket.setResolutionRecord(resolution);
            }
        }

        ticket.setUpdatedAt(LocalDateTime.now());
        IncidentTicket savedTicket = ticketRepository.save(ticket);

        // SYNC RESOURCE STATUS IF TERMINAL
        if (isTerminalStatus(newStatus)) {
            syncResourceStatusToActive(ticket.getResourceId());
        }

        return convertToResponseDTO(savedTicket);
    }

    private boolean isTerminalStatus(TicketStatus status) {
        return status == TicketStatus.RESOLVED || status == TicketStatus.CLOSED || status == TicketStatus.REJECTED;
    }

    private void syncResourceStatusToActive(String resourceId) {
        // Check if any other tickets for this resource are still OPEN or IN_PROGRESS
        boolean hasActiveTickets = ticketRepository.existsByResourceIdAndStatusIn(
                resourceId, List.of(TicketStatus.OPEN, TicketStatus.IN_PROGRESS));

        if (!hasActiveTickets) {
            resourceRepository.findById(resourceId).ifPresent(resource -> {
                resource.setStatus(ResourceStatus.ACTIVE);
                resource.setBookable(true);
                resourceRepository.save(resource);
            });
        }
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

        if (ticket.getStatus() != TicketStatus.OPEN) {
            throw new IllegalStateException("Protocol Violation: Cannot reassign technician once the incident transition has reached " + ticket.getStatus());
        }

        ticket.setAssignedTo(technicianId);
        ticket.setUpdatedAt(LocalDateTime.now());
        return convertToResponseDTO(ticketRepository.save(ticket));
    }

    private IncidentTicketResponseDTO convertToResponseDTO(IncidentTicket ticket) {
        User creator = userRepository.findById(ticket.getCreatedBy()).orElse(null);
        String createdByName = creator != null ? creator.getName() : "Unknown";
        String createdByEmail = creator != null ? creator.getEmail() : "Unknown";
        
        String assignedToName = ticket.getAssignedTo() != null ?
                userRepository.findById(ticket.getAssignedTo()).map(User::getName).orElse("Unknown") : null;
        
        Resource resource = resourceRepository.findById(ticket.getResourceId())
                .orElse(null);
        String resourceName = resource != null ? resource.getName() : "Campus General";
        Department department = resource != null ? resource.getDepartment() : null;

        return IncidentTicketResponseDTO.builder()
                .id(ticket.getId())
                .ticketId(ticket.getTicketId())
                .resourceId(ticket.getResourceId())
                .resourceName(resourceName)
                .resourceType(resource != null ? resource.getType() : null)
                .department(department)
                .category(ticket.getCategory())
                .description(ticket.getDescription())
                .priority(ticket.getPriority())
                .contactDetails(ticket.getContactDetails())
                .status(ticket.getStatus())
                .createdBy(ticket.getCreatedBy())
                .createdByName(createdByName)
                .createdByEmail(createdByEmail)
                .assignedTo(ticket.getAssignedTo())
                .assignedToName(assignedToName)
                .rejectionReason(ticket.getRejectionReason())
                .resolutionNotes(ticket.getResolutionRecord())
                .imageUrls(ticket.getImageUrls())
                .createdAt(ticket.getCreatedAt())
                .updatedAt(ticket.getUpdatedAt())
                .build();
    }
}
