import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PerformanceService, PerformanceReview, Goal } from '../../../core/services/performance.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommentDialogComponent } from '../../leaves/leave-approvals/comment-dialog.component';
import { SelfReviewDialogComponent } from './self-review-dialog.component';

@Component({
  selector: 'app-my-performance',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule,
    MatButtonModule, MatSliderModule, MatDividerModule, MatSnackBarModule,
    MatDialogModule, MatProgressBarModule, MatTooltipModule, MatIconModule
  ],
  template: `
    <div class="performance-container">
      <div class="page-header">
        <h1>My Performance Review</h1>
        <p class="subtitle">Review your goals and submit evaluations for the current cycle.</p>
      </div>

       <div class="review-grid">
        <!-- Goals Section -->
        <mat-card class="goals-card mb-4">
          <mat-card-header>
            <mat-card-title>Assigned Goals</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="goals.length === 0" class="no-data">No goals assigned yet.</div>
            
            <div class="goal-item" *ngFor="let goal of goals">
              <div class="goal-header">
                <div class="title-group">
                  <span class="goal-title">{{goal.title}}</span>
                  <span class="status-badge" [ngClass]="goal.status.toLowerCase()">{{goal.status}}</span>
                </div>
                <span class="goal-date">Target: {{goal.targetDate | date}}</span>
              </div>
              <p class="goal-desc">{{goal.description}}</p>
              
              <div class="progress-section">
                <div class="progress-label">
                  <span>Progress</span>
                  <span>{{goal.progress}}%</span>
                </div>
                <mat-progress-bar mode="determinate" [value]="goal.progress"></mat-progress-bar>
              </div>

              <div class="goal-actions mt-16">
                <button mat-raised-button color="primary" (click)="openSelfReviewDialog(goal)" 
                        [disabled]="goal.status === 'COMPLETED'">
                  <mat-icon>edit_note</mat-icon> Submit Self Review
                </button>
              </div>
              <mat-divider class="mt-16"></mat-divider>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Past Reviews List -->
        <mat-card class="history-card">
          <mat-card-header>
            <mat-card-title>My Review History</mat-card-title>
          </mat-card-header>
          <mat-card-content>
             <div class="past-review-item" *ngFor="let review of pastReviews">
                <div class="review-header">
                   <div class="cycle-info">
                      <span class="cycle">{{review.reviewCycle || 'Annual Review'}}</span>
                      <span class="status-pill" [ngClass]="review.status.toLowerCase()">{{review.status}}</span>
                   </div>
                   <div class="rating-box" *ngIf="review.rating">
                      <span class="label">Rating</span>
                      <span class="value">{{review.rating}}/5</span>
                   </div>
                </div>
                
                <div class="review-content">
                  <div class="section">
                    <strong>Your Self Review:</strong>
                    <p>{{review.selfReview || review.comments || 'N/A'}}</p>
                  </div>
                  <div class="section" *ngIf="review.managerFeedback">
                    <strong>Manager Feedback:</strong>
                    <p>{{review.managerFeedback}}</p>
                  </div>
                </div>
                <mat-divider></mat-divider>
             </div>
             
             <div *ngIf="pastReviews.length === 0" class="no-data">
                No review history found.
             </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./my-performance.component.scss']
})
export class MyPerformanceComponent implements OnInit {
  isSubmitting = false;
  pastReviews: PerformanceReview[] = [];
  goals: Goal[] = [];
  userId: number = 0;

  constructor(
    private performanceService: PerformanceService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userId = user.id || 1;
    }
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.performanceService.getHistory(this.userId).subscribe({
      next: (data) => this.pastReviews = data,
      error: (err) => console.error('Failed to load reviews', err)
    });

    this.performanceService.getGoals(this.userId).subscribe({
      next: (data) => this.goals = data,
      error: (err) => console.error('Failed to load goals', err)
    });
  }

  openSelfReviewDialog(goal: Goal) {
    const dialogRef = this.dialog.open(SelfReviewDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(reviewText => {
      if (reviewText) {
        this.submitSelfReview(reviewText);
      }
    });
  }

  private submitSelfReview(text: string) {
    this.isSubmitting = true;
    this.performanceService.submitSelfReview(this.userId, text).subscribe({
      next: () => {
        this.snackBar.open('Self review submitted successfully', 'Close', { duration: 3000 });
        this.isSubmitting = false;
        this.loadData();
      },
      error: (err: any) => {
        console.error('Submission failed', err);
        this.snackBar.open('Failed to submit review', 'Close', { duration: 3000 });
        this.isSubmitting = false;
      }
    });
  }
}
