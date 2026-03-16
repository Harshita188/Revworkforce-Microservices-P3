package com.revworkforce.performance_service.service;

import com.revworkforce.performance_service.entity.Goal;
import com.revworkforce.performance_service.entity.PerformanceReview;
import com.revworkforce.performance_service.entity.ReviewStatus;
import com.revworkforce.performance_service.repository.GoalRepository;
import com.revworkforce.performance_service.repository.ReviewRepository;
import com.revworkforce.performance_service.client.NotificationClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceService {
    private final ReviewRepository reviewRepository;
    private final GoalRepository goalRepository;
    private final NotificationClient notificationClient;

    public PerformanceReview submitSelfReview(Long employeeId, String selfReview) {
        PerformanceReview review = PerformanceReview.builder()
                .employeeId(employeeId)
                .selfReview(selfReview)
                .status(ReviewStatus.EMPLOYEE_SUBMITTED)
                .build();
        PerformanceReview savedReview = reviewRepository.save(review);
        
        try {
            notificationClient.sendNotification(NotificationClient.NotificationRequest.builder()
                    .recipientId(employeeId)
                    .message("Your self review has been submitted.")
                    .type("PERFORMANCE")
                    .build());
        } catch (Exception e) {
            // Log error and continue to not block the main transaction
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return savedReview;
    }

    public PerformanceReview provideManagerFeedback(Long reviewId, Long managerId, String feedback, Integer rating) {
        PerformanceReview review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setReviewerId(managerId);
        review.setReviewerFeedback(feedback);
        review.setRating(rating);
        review.setReviewDate(LocalDateTime.now());
        review.setStatus(ReviewStatus.FINALIZED);
        PerformanceReview savedReview = reviewRepository.save(review);

        try {
            notificationClient.sendNotification(NotificationClient.NotificationRequest.builder()
                    .recipientId(review.getEmployeeId())
                    .message("Your performance review has been finalized.")
                    .type("PERFORMANCE")
                    .build());
        } catch (Exception e) {
            // Log error and continue to not block the main transaction
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return savedReview;
    }

    public List<PerformanceReview> getReviewHistory(Long employeeId) {
        return reviewRepository.findByEmployeeId(employeeId);
    }

    public Goal addGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public List<Goal> getEmployeeGoals(Long employeeId) {
        return goalRepository.findByEmployeeId(employeeId);
    }
}
