package com.unisync.entity;

import com.unisync.enums.NotificationType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    /** The recipient's user ID */
    @Indexed
    private String recipientId;

    private String title;

    private String message;

    private NotificationType type;

    /** ID of the related booking or ticket — may be null for CUSTOM notifications */
    private String relatedEntityId;

    /** Fields to support management of sent messages */
    private String senderId;
    private String senderName;
    
    @Indexed
    private String broadcastId;

    /** Display name for the target group or specific recipient used in Sent History */
    private String targetDisplayName;

    @Builder.Default
    private boolean read = false;

    private LocalDateTime createdAt;
}
