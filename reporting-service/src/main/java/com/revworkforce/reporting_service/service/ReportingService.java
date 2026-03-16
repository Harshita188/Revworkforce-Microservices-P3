package com.revworkforce.reporting_service.service;

import com.revworkforce.reporting_service.client.EmployeeClient;
import com.revworkforce.reporting_service.dto.HRDashboardData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class ReportingService {
    private final EmployeeClient employeeClient;

    public HRDashboardData getDashboardSummary() {
        return HRDashboardData.builder()
                .totalEmployees(employeeClient.getEmployeeCount())
                .activeLeaveRequests(0) // Placeholder
                .leaveTypeDistribution(new HashMap<>())
                .pendingPerformanceReviews(0) // Placeholder
                .build();
    }
}
