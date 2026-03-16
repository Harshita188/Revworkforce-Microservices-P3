package com.revworkforce.performance_service.controller;

import com.revworkforce.performance_service.entity.Goal;
import com.revworkforce.performance_service.entity.PerformanceReview;
import com.revworkforce.performance_service.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
public class PerformanceController {
    private final PerformanceService performanceService;

    @PostMapping("/self-review")
    public ResponseEntity<PerformanceReview> submitSelfReview(@RequestParam Long employeeId,
            @RequestBody String selfReview) {
        return ResponseEntity.ok(performanceService.submitSelfReview(employeeId,
                selfReview));
    }
    // @PostMapping("/self-review")
    // public ResponseEntity<PerformanceReview> submitSelfReview(
    // @RequestBody SelfReviewRequest request) {

    // return ResponseEntity.ok(
    // performanceService.submitSelfReview(
    // request.getEmployeeId(),
    // request.getSelfReview()));
    // }

    @PostMapping("/manager-feedback/{reviewId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<PerformanceReview> provideFeedback(@PathVariable Long reviewId, @RequestParam Long managerId,
            @RequestParam String feedback, @RequestParam Integer rating) {
        return ResponseEntity.ok(performanceService.provideManagerFeedback(reviewId, managerId, feedback, rating));
    }

    @GetMapping("/history/{employeeId}")
    public ResponseEntity<List<PerformanceReview>> getHistory(@PathVariable Long employeeId) {
        return ResponseEntity.ok(performanceService.getReviewHistory(employeeId));
    }

    @PostMapping("/goals")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Goal> addGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(performanceService.addGoal(goal));
    }

    @GetMapping("/goals/{employeeId}")
    public ResponseEntity<List<Goal>> getGoals(@PathVariable Long employeeId) {
        return ResponseEntity.ok(performanceService.getEmployeeGoals(employeeId));
    }
}
