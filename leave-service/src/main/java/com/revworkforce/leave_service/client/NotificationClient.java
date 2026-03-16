package com.revworkforce.leave_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import lombok.Data;
import com.revworkforce.leave_service.config.FeignConfig;

@FeignClient(name = "notification-service", path = "/api/notifications", configuration = FeignConfig.class)
public interface NotificationClient {

    @PostMapping("/send")
    void sendNotification(@RequestBody NotificationRequest request);

    @Data
    class NotificationRequest {
        private Long recipientId;
        private String message;
        private String type;
    }
}
