package com.unisync.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/technician")
public class TechnicianController {

    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, String>> getTechnicianDashboard() {
        return ResponseEntity.ok(Map.of("message", "Welcome to the Technician Dashboard!"));
    }
}
