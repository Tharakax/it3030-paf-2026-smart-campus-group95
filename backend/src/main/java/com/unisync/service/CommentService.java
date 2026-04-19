package com.unisync.service;

import com.unisync.dto.CommentDTO;
import com.unisync.entity.Comment;
import com.unisync.entity.IncidentTicket;
import com.unisync.entity.User;
import com.unisync.enums.NotificationType;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.exception.UnauthorizedException;
import com.unisync.repository.CommentRepository;
import com.unisync.repository.IncidentTicketRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final IncidentTicketRepository incidentTicketRepository;
    private final NotificationService notificationService;

    public CommentDTO addComment(String ticketId, String content, User currentUser) {
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .userId(currentUser.getId())
                .authorName(currentUser.getName())
                .authorRole(currentUser.getRole().toString())
                .content(content)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Notify the relevant party
        incidentTicketRepository.findById(ticketId).ifPresent(ticket -> {
            // Determine recipient: logic is to notify the "other" person in the conversation
            if (currentUser.getId().equals(ticket.getCreatedBy())) {
                // Reporter commented -> notify technician (if assigned)
                if (ticket.getAssignedTo() != null) {
                    sendCommentNotification(ticket.getAssignedTo(), ticket, currentUser, content);
                }
            } else if (currentUser.getId().equals(ticket.getAssignedTo())) {
                // Technician commented -> notify reporter
                sendCommentNotification(ticket.getCreatedBy(), ticket, currentUser, content);
            } else {
                // Third party (Admin) commented -> notify both original reporter and assignee
                sendCommentNotification(ticket.getCreatedBy(), ticket, currentUser, content);
                if (ticket.getAssignedTo() != null && !ticket.getAssignedTo().equals(currentUser.getId())) {
                    sendCommentNotification(ticket.getAssignedTo(), ticket, currentUser, content);
                }
            }
        });

        return convertToDTO(savedComment);
    }

    private void sendCommentNotification(String recipientId, IncidentTicket ticket, User sender, String content) {
        // Truncate content for notification if too long
        String preview = content.length() > 100 ? content.substring(0, 97) + "..." : content;

        notificationService.createNotification(
                recipientId,
                "New message on Ticket #" + ticket.getTicketId(),
                sender.getName() + ": " + preview,
                NotificationType.TICKET_COMMENT,
                ticket.getId(),
                sender.getId(),
                sender.getName(),
                null,
                "Ticket ID: " + ticket.getTicketId()
        );
    }

    public List<CommentDTO> getCommentsByTicket(String ticketId) {
        return commentRepository.findByTicketId(ticketId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CommentDTO updateComment(String id, String newContent, User currentUser) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only edit your own comments");
        }

        comment.setContent(newContent);
        comment.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(commentRepository.save(comment));
    }

    public void deleteComment(String id, User currentUser) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found"));

        if (!comment.getUserId().equals(currentUser.getId())) {
            throw new UnauthorizedException("You can only delete your own comments");
        }

        commentRepository.delete(comment);
    }

    private CommentDTO convertToDTO(Comment comment) {
        return CommentDTO.builder()
                .id(comment.getId())
                .ticketId(comment.getTicketId())
                .userId(comment.getUserId())
                .authorName(comment.getAuthorName())
                .authorRole(comment.getAuthorRole())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
