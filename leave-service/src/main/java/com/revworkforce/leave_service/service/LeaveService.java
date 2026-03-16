package com.revworkforce.leave_service.service;

import com.revworkforce.leave_service.client.NotificationClient;
import com.revworkforce.leave_service.dto.LeaveApplicationRequest;
import com.revworkforce.leave_service.dto.LeaveApprovalRequest;
import com.revworkforce.leave_service.entity.LeaveBalance;
import com.revworkforce.leave_service.entity.LeaveRequest;
import com.revworkforce.leave_service.entity.LeaveStatus;
import com.revworkforce.leave_service.entity.LeaveType;
import com.revworkforce.leave_service.repository.LeaveBalanceRepository;
import com.revworkforce.leave_service.repository.LeaveRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaveService {

    private final LeaveRepository leaveRepository;
    private final LeaveBalanceRepository balanceRepository;
    private final NotificationClient notificationClient;

    @Transactional
    public LeaveRequest applyForLeave(LeaveApplicationRequest request) {
        // 1. Check balance
        LeaveBalance balance = balanceRepository
                .findByEmployeeIdAndLeaveType(request.getEmployeeId(), request.getLeaveType())
                .orElseThrow(() -> new RuntimeException("Leave balance not found for employee"));

        long requestedDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;

        if (balance.getRemaining() < requestedDays) {
            throw new RuntimeException("Insufficient leave balance. Available: " + balance.getRemaining());
        }

        // 2. Create request
        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employeeId(request.getEmployeeId())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .leaveType(request.getLeaveType())
                .reason(request.getReason())
                .status(LeaveStatus.PENDING)
                .build();

        LeaveRequest saved = leaveRepository.save(leaveRequest);

        // 3. Notify
        sendNotification(request.getEmployeeId(), "Your leave request has been submitted.", "LEAVE");

        return saved;
    }

    @Transactional
    public LeaveRequest approveLeave(LeaveApprovalRequest request) {
        LeaveRequest leaveRequest = leaveRepository.findById(request.getRequestId())
                .orElseThrow(() -> new RuntimeException("Leave request not found"));

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Leave request is already " + leaveRequest.getStatus());
        }

        if (request.getStatus() == LeaveStatus.APPROVED) {
            // Deduct from balance
            LeaveBalance balance = balanceRepository
                    .findByEmployeeIdAndLeaveType(leaveRequest.getEmployeeId(), leaveRequest.getLeaveType())
                    .orElseThrow(() -> new RuntimeException("Leave balance not found"));

            long requestedDays = ChronoUnit.DAYS.between(leaveRequest.getStartDate(), leaveRequest.getEndDate()) + 1;

            if (balance.getRemaining() < requestedDays) {
                throw new RuntimeException("Insufficient balance to approve this leave");
            }

            balance.setUsed(balance.getUsed() + (int) requestedDays);
            balanceRepository.save(balance);
        }

        leaveRequest.setStatus(request.getStatus());
        leaveRequest.setManagerComment(request.getManagerComment());
        leaveRequest.setApprovedBy(request.getManagerId());

        LeaveRequest saved = leaveRepository.save(leaveRequest);

        // Notify
        String msg = "Your leave request has been " + request.getStatus();
        sendNotification(saved.getEmployeeId(), msg, "LEAVE");

        return saved;
    }

    private void sendNotification(Long empId, String msg, String type) {
        try {
            NotificationClient.NotificationRequest notificationRequest = new NotificationClient.NotificationRequest();
            notificationRequest.setRecipientId(empId);
            notificationRequest.setMessage(msg);
            notificationRequest.setType(type);
            notificationClient.sendNotification(notificationRequest);
        } catch (Exception e) {
            e.printStackTrace();
        }
        // } catch (Exception e) {
        //     // Log and continue - notification failure shouldn't break the business process
        // }
    }
    // ... rest of the service

    public List<LeaveRequest> getLeaveHistory(Long employeeId) {
        return leaveRepository.findByEmployeeId(employeeId);
    }

    public List<LeaveBalance> getBalances(Long employeeId) {
        return balanceRepository.findByEmployeeId(employeeId);
    }
//     public List<LeaveRequest> getPendingLeaves() {
//     return leaveRepository.findByStatus("PENDING");
// }
public List<LeaveRequest> getPendingLeaves() {
    return leaveRepository.findByStatus(LeaveStatus.PENDING);
}

    @Transactional
    public void initializeBalances(Long employeeId) {
        // Simple initialization
        for (LeaveType type : LeaveType.values()) {
            if (balanceRepository.findByEmployeeIdAndLeaveType(employeeId, type).isEmpty()) {
                balanceRepository.save(LeaveBalance.builder()
                        .employeeId(employeeId)
                        .leaveType(type)
                        .quota(10) // Default 10 days
                        .used(0)
                        .build());
            }
        }
    }
}
