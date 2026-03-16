package com.revworkforce.reporting_service.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class HRDashboardData {
    private long totalEmployees;
    private long activeLeaveRequests;
    private Map<String, Long> leaveTypeDistribution;
    private long pendingPerformanceReviews;
}
