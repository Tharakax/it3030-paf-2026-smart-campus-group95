package com.unisync.dto;

import com.unisync.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {

    private String id;
    private String recipientId;
    private String title;
    private String message;
    private NotificationType type;
    private String relatedEntityId;
    private String senderId;
    private String senderName;
    private String broadcastId;
    private String targetDisplayName;
    private boolean isRead;
    private LocalDateTime createdAt;
}
