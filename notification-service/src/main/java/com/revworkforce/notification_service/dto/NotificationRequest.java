package com.revworkforce.notification_service.dto;

import lombok.Data;

@Data
public class NotificationRequest {
    private Long recipientId;
    private String message;
    private String type;
}
