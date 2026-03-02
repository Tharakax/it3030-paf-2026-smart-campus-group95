package com.unisync.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getUserDashboard() {
        return ResponseEntity.ok(Map.of("message", "Welcome to the User Dashboard!"));
    }
}
