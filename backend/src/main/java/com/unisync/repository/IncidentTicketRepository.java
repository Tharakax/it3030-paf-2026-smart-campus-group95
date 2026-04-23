package com.unisync.repository;

import com.unisync.entity.IncidentTicket;
import com.unisync.enums.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface IncidentTicketRepository extends MongoRepository<IncidentTicket, String> {
    List<IncidentTicket> findByCreatedBy(String createdBy);
    List<IncidentTicket> findByAssignedTo(String assignedTo);
    List<IncidentTicket> findByStatus(TicketStatus status);
    boolean existsByResourceIdAndStatusIn(String resourceId, Collection<TicketStatus> statuses);
    boolean existsByCreatedByAndResourceIdAndStatusIn(String createdBy, String resourceId, Collection<TicketStatus> statuses);
}
