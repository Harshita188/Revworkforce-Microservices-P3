package com.revworkforce.reporting_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;

@FeignClient(name = "employee-service")
public interface EmployeeClient {

    @GetMapping("/employees/count")
    @CircuitBreaker(name = "employeeService", fallbackMethod = "getCountFallback")
    long getEmployeeCount();

    default long getCountFallback(Exception e) {
        return -1; // Fallback value
    }
}
