package com.unisync.service;

import com.unisync.entity.LoginLog;
import com.unisync.entity.User;
import com.unisync.enums.LogType;
import com.unisync.repository.LoginLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoginLogService {

    private final LoginLogRepository loginLogRepository;

    public void logLogin(User user) {
        LoginLog log = LoginLog.builder()
                .userId(user.getId())
                .userName(user.getName())
                .type(LogType.LOGIN)
                .timestamp(LocalDateTime.now())
                .build();
        loginLogRepository.save(log);
    }

    public void logLogout(User user) {
        LoginLog log = LoginLog.builder()
                .userId(user.getId())
                .userName(user.getName())
                .type(LogType.LOGOUT)
                .timestamp(LocalDateTime.now())
                .build();
        loginLogRepository.save(log);
    }

    public void logLoginFailure(User user) {
        LoginLog log = LoginLog.builder()
                .userId(user.getId())
                .userName(user.getName())
                .type(LogType.LOGIN_FAILURE)
                .timestamp(LocalDateTime.now())
                .build();
        loginLogRepository.save(log);
    }

    public void logLoginFailure(String email) {
        LoginLog log = LoginLog.builder()
                .userId("N/A")
                .userName(email)
                .type(LogType.LOGIN_FAILURE)
                .timestamp(LocalDateTime.now())
                .build();
        loginLogRepository.save(log);
    }

    public List<LoginLog> getAllLogs() {
        return loginLogRepository.findAllByOrderByTimestampDesc();
    }
}
