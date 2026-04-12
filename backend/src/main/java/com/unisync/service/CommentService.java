package com.unisync.service;

import com.unisync.dto.CommentDTO;
import com.unisync.entity.Comment;
import com.unisync.entity.User;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.exception.UnauthorizedException;
import com.unisync.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public CommentDTO addComment(String ticketId, String content, User currentUser) {
        Comment comment = Comment.builder()
                .ticketId(ticketId)
                .userId(currentUser.getId())
                .authorName(currentUser.getName())
                .content(content)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return convertToDTO(commentRepository.save(comment));
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
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .build();
    }
}
