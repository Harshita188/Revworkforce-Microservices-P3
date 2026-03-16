package com.revworkforce.leave_service.dto;

import com.revworkforce.leave_service.entity.LeaveStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LeaveApprovalRequest {

    @NotNull(message = "Request ID is required")
    private Long requestId;

    @NotNull(message = "Status is required")
    private LeaveStatus status;

    private String managerComment;

    @NotNull(message = "Manager ID is required")
    private Long managerId;
}
