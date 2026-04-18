package com.unisync.controller;

import com.unisync.dto.CustomNotificationRequest;
import com.unisync.dto.NotificationDTO;
import com.unisync.entity.Role;
import com.unisync.exception.UnauthorizedException;
import com.unisync.security.UserPrincipal;
import com.unisync.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    /** Get all notifications for the authenticated user */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getMyNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(notificationService.getNotificationsForUser(principal.getUser().getId()));
    }

    /** Get only the unread count (for the badge) */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = notificationService.getUnreadCount(principal.getUser().getId());
        return ResponseEntity.ok(Map.of("count", count));
    }

    /** Mark a single notification as read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAsRead(id, principal.getUser().getId());
        return ResponseEntity.ok().build();
    }

    /** Mark all notifications as read for the authenticated user */
    @PatchMapping("/read-all")
    public ResponseEntity<Void> markAllAsRead(
            @AuthenticationPrincipal UserPrincipal principal) {
        notificationService.markAllAsRead(principal.getUser().getId());
        return ResponseEntity.ok().build();
    }

    /** Send a custom notification — restricted to ADMIN and TECHNICIAN roles */
    @PostMapping("/send")
    public ResponseEntity<Void> sendCustomNotification(
            @Valid @RequestBody CustomNotificationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        Role role = principal.getUser().getRole();
        if (role != Role.ADMIN && role != Role.TECHNICIAN) {
            throw new UnauthorizedException("Only admins and technicians can send custom notifications");
        }

        notificationService.sendCustomNotification(request, principal.getUser());
        return ResponseEntity.ok().build();
    }

    /** Get history of notifications sent by the authenticated user */
    @GetMapping("/sent")
    public ResponseEntity<List<NotificationDTO>> getSentNotifications(
            @AuthenticationPrincipal UserPrincipal principal) {
        Role role = principal.getUser().getRole();
        if (role != Role.ADMIN && role != Role.TECHNICIAN) {
            throw new UnauthorizedException("Only admins and technicians can view sent history");
        }
        return ResponseEntity.ok(notificationService.getSentNotifications(principal.getUser().getId()));
    }

    /** Update an existing broadcast / custom notification */
    @PutMapping("/broadcast/{broadcastId}")
    public ResponseEntity<Void> updateBroadcast(
            @PathVariable String broadcastId,
            @RequestBody Map<String, String> updates,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        String title = updates.get("title");
        String message = updates.get("message");
        
        notificationService.updateBroadcast(broadcastId, title, message, principal.getUser().getId());
        return ResponseEntity.ok().build();
    }

    /** Retract a broadcast / custom notification */
    @DeleteMapping("/broadcast/{broadcastId}")
    public ResponseEntity<Void> deleteBroadcast(
            @PathVariable String broadcastId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        notificationService.deleteBroadcast(broadcastId, principal.getUser().getId());
        return ResponseEntity.ok().build();
    }
}
