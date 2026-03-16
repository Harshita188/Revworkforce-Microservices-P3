package com.revworkforce.notification_service.service;

import com.revworkforce.notification_service.dto.NotificationRequest;
import com.revworkforce.notification_service.entity.Notification;
import com.revworkforce.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public Notification sendNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .recipientId(request.getRecipientId())
                .message(request.getMessage())
                .type(request.getType())
                .sentAt(LocalDateTime.now())
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(Long employeeId) {
        return notificationRepository.findByRecipientIdOrderBySentAtDesc(employeeId);
    }
}
