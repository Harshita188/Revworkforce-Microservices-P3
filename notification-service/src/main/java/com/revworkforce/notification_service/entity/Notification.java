package com.revworkforce.notification_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long recipientId; // Employee ID

    @Column(nullable = false)
    private String message;

    private String type; // LEAVE, PERFORMANCE, ANNOUNCEMENT

    private LocalDateTime sentAt;

    private boolean isRead = false;
}
