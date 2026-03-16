package com.revworkforce.reporting_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "leave-service")
public interface LeaveClient {

    @GetMapping("/api/leaves/pending")
    List<Object> getPendingLeaves();
}
