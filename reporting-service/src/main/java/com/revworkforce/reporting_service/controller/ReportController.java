package com.revworkforce.reporting_service.controller;

import com.revworkforce.reporting_service.dto.HRDashboardData;
import com.revworkforce.reporting_service.service.ReportingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {
    private final ReportingService reportingService;

    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HRDashboardData> getDashboard() {
        return ResponseEntity.ok(reportingService.getDashboardSummary());
    }
}
