package com.revworkforce.reporting_service.service;

import com.revworkforce.reporting_service.client.EmployeeClient;
import com.revworkforce.reporting_service.dto.HRDashboardData;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import com.revworkforce.reporting_service.client.LeaveClient;
import com.revworkforce.reporting_service.client.PerformanceClient;


@Service
@RequiredArgsConstructor
public class ReportingService {
    private final LeaveClient leaveClient;
    private final PerformanceClient performanceClient;
    private final EmployeeClient employeeClient;

    public HRDashboardData getDashboardSummary() {
        long totalEmployees = 0;
        try {
            totalEmployees = employeeClient.getEmployeeCount();
        } catch (Exception e) {
            totalEmployees = -1;
        }

        long pendingLeaves = 0;
        try {
            pendingLeaves = leaveClient.getPendingLeaves().size();
        } catch (Exception e) {
            pendingLeaves = 0;
        }

        return HRDashboardData.builder()
                .totalEmployees(totalEmployees)
                .activeLeaveRequests(pendingLeaves)
                .leaveTypeDistribution(new HashMap<>())
                .pendingPerformanceReviews(0) // Still placeholder until Performance SVC improved
                .build();
    }
}
