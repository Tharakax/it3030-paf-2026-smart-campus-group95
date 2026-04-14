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

    @GetMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<List<CommentDTO>> getComments(@PathVariable String ticketId) {
        return ResponseEntity.ok(commentService.getCommentsByTicket(ticketId));
    }

    @PostMapping("/tickets/{ticketId}/comments")
    public ResponseEntity<CommentDTO> addComment(
            @PathVariable String ticketId,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String content = request.get("content");
        return ResponseEntity.ok(commentService.addComment(ticketId, content, principal.getUser()));
    }

    @PutMapping("/comments/{id}")
    public ResponseEntity<CommentDTO> updateComment(
            @PathVariable String id,
            @RequestBody Map<String, String> request,
            @AuthenticationPrincipal UserPrincipal principal) {
        String content = request.get("content");
        return ResponseEntity.ok(commentService.updateComment(id, content, principal.getUser()));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        commentService.deleteComment(id, principal.getUser());
        return ResponseEntity.noContent().build();
    }
}
