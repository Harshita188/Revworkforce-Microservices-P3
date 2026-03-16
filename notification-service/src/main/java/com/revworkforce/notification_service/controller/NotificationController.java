package com.revworkforce.notification_service.controller;

import com.revworkforce.notification_service.dto.NotificationRequest;
import com.revworkforce.notification_service.entity.Notification;
import com.revworkforce.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping("/send")
    public ResponseEntity<Notification> send(@RequestBody NotificationRequest request) {
        return ResponseEntity.ok(notificationService.sendNotification(request));
    }

    @GetMapping("/{employeeId}")
    public ResponseEntity<List<Notification>> get(@PathVariable Long employeeId) {
        return ResponseEntity.ok(notificationService.getNotifications(employeeId));
    }
}
