package com.revworkforce.leave_service.controller;

import com.revworkforce.leave_service.dto.LeaveApplicationRequest;
import com.revworkforce.leave_service.dto.LeaveApprovalRequest;
import com.revworkforce.leave_service.entity.LeaveBalance;
import com.revworkforce.leave_service.entity.LeaveRequest;
import com.revworkforce.leave_service.service.LeaveService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveController {

    private final LeaveService leaveService;

    @PostMapping("/apply")
    public ResponseEntity<LeaveRequest> apply(@Valid @RequestBody LeaveApplicationRequest request) {
        return ResponseEntity.ok(leaveService.applyForLeave(request));
    }

    @PostMapping("/approve")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<LeaveRequest> approve(@Valid @RequestBody LeaveApprovalRequest request) {
        return ResponseEntity.ok(leaveService.approveLeave(request));
    }

    @GetMapping("/history/{employeeId}")
    public ResponseEntity<List<LeaveRequest>> getHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getLeaveHistory(employeeId));
    }

    @GetMapping("/balances/{employeeId}")
    public ResponseEntity<List<LeaveBalance>> getBalances(@PathVariable Long employeeId) {
        return ResponseEntity.ok(leaveService.getBalances(employeeId));
    }

    @PostMapping("/initialize/{employeeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> initialize(@PathVariable Long employeeId) {
        leaveService.initializeBalances(employeeId);
        return ResponseEntity.ok("Balances initialized");
    }
    @GetMapping("/pending")
@PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
public ResponseEntity<List<LeaveRequest>> getPendingLeaves() {
    return ResponseEntity.ok(leaveService.getPendingLeaves());
}
}
