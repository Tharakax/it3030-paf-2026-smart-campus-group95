package com.unisync.service;

import com.unisync.dto.CustomNotificationRequest;
import com.unisync.dto.NotificationDTO;
import com.unisync.entity.Notification;
import com.unisync.entity.Role;
import com.unisync.entity.User;
import com.unisync.enums.NotificationType;
import com.unisync.exception.ResourceNotFoundException;
import com.unisync.exception.UnauthorizedException;
import com.unisync.repository.NotificationRepository;
import com.unisync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ─── Core creation helpers ────────────────────────────────────────────────

    /**
     * Create a notification for a single, specific user.
     */
    public void createNotification(String recipientId,
                                   String title,
                                   String message,
                                   NotificationType type,
                                   String relatedEntityId,
                                   String senderId,
                                   String senderName,
                                   String broadcastId,
                                   String targetDisplayName) {
        Notification notification = Notification.builder()
                .recipientId(recipientId)
                .title(title)
                .message(message)
                .type(type)
                .relatedEntityId(relatedEntityId)
                .senderId(senderId)
                .senderName(senderName)
                .broadcastId(broadcastId)
                .targetDisplayName(targetDisplayName)
                .read(false)
                .createdAt(LocalDateTime.now())
                .build();
        notificationRepository.save(notification);
        log.debug("Notification saved for user {}: {}", recipientId, title);
    }

    /**
     * Fan-out: create individual notification records for every user with the given role.
     */
    public void createBroadcastNotification(Role role,
                                            String title,
                                            String message,
                                            NotificationType type,
                                            String relatedEntityId,
                                            String senderId,
                                            String senderName,
                                            String targetDisplayName) {
        String broadcastId = java.util.UUID.randomUUID().toString();
        List<User> recipients = userRepository.findByRole(role);
        for (User recipient : recipients) {
            createNotification(recipient.getId(), title, message, type, relatedEntityId, senderId, senderName, broadcastId, targetDisplayName);
        }
        log.debug("Broadcast notification sent to {} users with role {}: {}", recipients.size(), role, title);
    }

    // ─── Query methods ──────────────────────────────────────────────────────

    public List<NotificationDTO> getNotificationsForUser(String userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByRecipientIdAndReadFalse(userId);
    }

    // ─── Mark-as-read ───────────────────────────────────────────────────────

    public void markAsRead(String notificationId, String userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + notificationId));
        if (!notification.getRecipientId().equals(userId)) {
            throw new UnauthorizedException("Cannot mark another user's notification as read");
        }
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> unread = notificationRepository.findByRecipientIdAndReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    // ─── Custom / broadcast send ─────────────────────────────────────────────

    /**
     * Validates role permissions and dispatches the custom notification.
     * ADMINs can send to anyone. TECHNICIANs can only send to USERs.
     */
    public void sendCustomNotification(CustomNotificationRequest request, User sender) {
        CustomNotificationRequest.TargetType targetType = request.getTargetType();

        // Technician restriction: cannot target technicians
        if (sender.getRole() == Role.TECHNICIAN) {
            if (targetType == CustomNotificationRequest.TargetType.ALL_TECHNICIANS
                    || targetType == CustomNotificationRequest.TargetType.SPECIFIC_TECHNICIAN) {
                throw new UnauthorizedException("Technicians can only send notifications to users");
            }
        }

        String broadcastId = targetType.toString().contains("ALL") ? java.util.UUID.randomUUID().toString() : null;

        switch (targetType) {
            case ALL_USERS -> createBroadcastNotification(
                    Role.USER, request.getTitle(), request.getMessage(),
                    NotificationType.CUSTOM, null, sender.getId(), sender.getName(), "All Standard Users");

            case ALL_TECHNICIANS -> createBroadcastNotification(
                    Role.TECHNICIAN, request.getTitle(), request.getMessage(),
                    NotificationType.CUSTOM, null, sender.getId(), sender.getName(), "All Technicians");

            case SPECIFIC_USER -> {
                User target = resolveUser(request.getTargetId(), Role.USER);
                createNotification(target.getId(), request.getTitle(), request.getMessage(),
                        NotificationType.CUSTOM, null, sender.getId(), sender.getName(), null, "User: " + target.getName());
            }

            case SPECIFIC_TECHNICIAN -> {
                User target = resolveUser(request.getTargetId(), Role.TECHNICIAN);
                createNotification(target.getId(), request.getTitle(), request.getMessage(),
                        NotificationType.CUSTOM, null, sender.getId(), sender.getName(), null, "Technician: " + target.getName());
            }
        }
    }

    // ─── Broadcast Management ────────────────────────────────────────────────

    public List<NotificationDTO> getSentNotifications(String senderId) {
        return notificationRepository.findBySenderIdOrderByCreatedAtDesc(senderId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public void updateBroadcast(String broadcastId, String title, String message, String senderId) {
        List<Notification> notifications = notificationRepository.findByBroadcastId(broadcastId);
        if (notifications.isEmpty()) {
            // Fallback for non-broadcast (single user) custom notifications
            Notification n = notificationRepository.findById(broadcastId) // In this case 'broadcastId' might be the id itself if passed as such
                    .orElseThrow(() -> new ResourceNotFoundException("Notification record not found"));
            notifications = List.of(n);
        }

        // Security check: must be the sender and type must be CUSTOM
        for (Notification n : notifications) {
            if (!n.getSenderId().equals(senderId)) {
                throw new UnauthorizedException("You are not the sender of this notification");
            }
            if (n.getType() != NotificationType.CUSTOM) {
                throw new IllegalArgumentException("Automated notifications cannot be edited");
            }
            n.setTitle(title);
            n.setMessage(message);
            n.setRead(false); // Reset to unread as requested
        }

        notificationRepository.saveAll(notifications);
        log.info("Broadcast {} updated by sender {}", broadcastId, senderId);
    }

    public void deleteBroadcast(String broadcastId, String senderId) {
        List<Notification> notifications = notificationRepository.findByBroadcastId(broadcastId);
        
        // Handle single-recipient custom notification
        if (notifications.isEmpty()) {
            Notification n = notificationRepository.findById(broadcastId).orElse(null);
            if (n != null) notifications = List.of(n);
        }

        if (notifications.isEmpty()) return;

        // Security check
        for (Notification n : notifications) {
            if (!n.getSenderId().equals(senderId)) {
                throw new UnauthorizedException("You are not the sender of this notification");
            }
            if (n.getType() != NotificationType.CUSTOM) {
                throw new IllegalArgumentException("Automated notifications cannot be deleted");
            }
        }

        if (notifications.get(0).getBroadcastId() != null) {
            notificationRepository.deleteByBroadcastId(notifications.get(0).getBroadcastId());
        } else {
            notificationRepository.deleteById(notifications.get(0).getId());
        }
        log.info("Broadcast {} (or specific notification) deleted by sender {}", broadcastId, senderId);
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    private User resolveUser(String userId, Role expectedRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        if (user.getRole() != expectedRole) {
            throw new IllegalArgumentException("Target user does not have the expected role: " + expectedRole);
        }
        return user;
    }

    private NotificationDTO toDTO(Notification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .recipientId(n.getRecipientId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .relatedEntityId(n.getRelatedEntityId())
                .senderId(n.getSenderId())
                .senderName(n.getSenderName())
                .broadcastId(n.getBroadcastId())
                .targetDisplayName(n.getTargetDisplayName())
                .isRead(n.isRead())
                .createdAt(n.getCreatedAt())
                .build();
    }
}
