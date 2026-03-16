package com.revworkforce.performance_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "performance_reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long employeeId;

    @Column(nullable = false)
    private Long reviewerId; // Manager ID

    @Column(columnDefinition = "TEXT")
    private String selfReview;

    @Column(columnDefinition = "TEXT")
    private String reviewerFeedback;

    private Integer rating; // 1-5

    private LocalDateTime reviewDate;

    @Enumerated(EnumType.STRING)
    private ReviewStatus status;
}
