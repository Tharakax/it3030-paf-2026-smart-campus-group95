package com.unisync.controller;

import com.unisync.dto.CommentDTO;
import com.unisync.security.UserPrincipal;
import com.unisync.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @PostMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String content = body.get("content");
        return ResponseEntity.ok(commentService.addComment(ticketId, content, userPrincipal.getUser()));
    }

    @GetMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<List<CommentDTO>> getCommentsByTicket(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable String id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        String content = body.get("content");
        return ResponseEntity.ok(commentService.updateComment(id, content, userPrincipal.getUser()));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        commentService.deleteComment(id, userPrincipal.getUser());
        return ResponseEntity.noContent().build();
    }
}
