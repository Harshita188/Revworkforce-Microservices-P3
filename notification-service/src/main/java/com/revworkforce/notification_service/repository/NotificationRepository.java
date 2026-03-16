package com.revworkforce.notification_service.repository;

import com.revworkforce.notification_service.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientIdOrderBySentAtDesc(Long recipientId);
}
