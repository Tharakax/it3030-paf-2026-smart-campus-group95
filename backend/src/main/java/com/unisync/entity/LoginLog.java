package com.unisync.entity;

import com.unisync.enums.LogType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "login_logs")
public class LoginLog {
    @Id
    private String id;
    private String userId;
    private String userName;
    private LogType type;
    private LocalDateTime timestamp;
}
