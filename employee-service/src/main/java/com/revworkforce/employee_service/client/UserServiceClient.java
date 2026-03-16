package com.revworkforce.employee_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import java.util.Map;
import com.revworkforce.employee_service.config.FeignConfig;

@FeignClient(name = "USER-SERVICE", configuration = FeignConfig.class)
public interface UserServiceClient {

    @GetMapping("/users/{id}")
    Map<String, Object> getUserById(@PathVariable Long id);
}