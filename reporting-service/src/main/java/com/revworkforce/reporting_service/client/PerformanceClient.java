package com.revworkforce.reporting_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;

@FeignClient(name = "performance-service")
public interface PerformanceClient {

    @GetMapping("/api/performance/history/all") // I'll check if this exists or add it
    List<Object> getAllReviews();
}
