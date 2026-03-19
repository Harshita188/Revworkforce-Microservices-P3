import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PerformanceService, PerformanceReview } from '../../../core/services/performance.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { User } from '../../../core/models/core.models';

@Component({
  selector: 'app-team-performance',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatPaginatorModule,
    MatSortModule, MatButtonModule, MatIconModule, MatExpansionModule,
    MatInputModule, MatDividerModule, MatSnackBarModule, MatSliderModule
  ],
  template: `
    <div class="page-header">
      <h1>Team Performance Reviews</h1>
      <p class="subtitle">Evaluate and provide feedback for your direct reports.</p>
    </div>

    <div class="mat-elevation-z8 table-container">
      <table mat-table [dataSource]="dataSource" matSort multiTemplateDataRows>

        <!-- Employee Name Column -->
        <ng-container matColumnDef="employeeName">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Employee </th>
          <td mat-cell *matCellDef="let row"> {{row.employeeName || 'Unknown'}} </td>
        </ng-container>

        <!-- Goal Title Column -->
        <ng-container matColumnDef="goalTitle">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Goal </th>
          <td mat-cell *matCellDef="let row"> {{row.goalTitle || 'Performance Review'}} </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let row">
             <span class="status-badge" [ngClass]="row.status?.toLowerCase()">
                {{row.status === 'EMPLOYEE_SUBMITTED' ? 'Needs Review' : row.status}}
             </span>
          </td>
        </ng-container>

        <!-- Expand Action Column -->
        <ng-container matColumnDef="expand">
          <th mat-header-cell *matHeaderCellDef aria-label="row actions">&nbsp;</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button aria-label="expand row" (click)="(expandedElement = expandedElement === row ? null : row); $event.stopPropagation()">
              <mat-icon *ngIf="expandedElement !== row">keyboard_arrow_down</mat-icon>
              <mat-icon *ngIf="expandedElement === row">keyboard_arrow_up</mat-icon>
            </button>
          </td>
        </ng-container>

        <!-- Expanded Content Detail Row -->
        <ng-container matColumnDef="expandedDetail">
          <td mat-cell *matCellDef="let row" [attr.colspan]="displayedColumnsWithExpand.length">
            <div class="element-detail" [@detailExpand]="row === expandedElement ? 'expanded' : 'collapsed'" *ngIf="row === expandedElement">
               
               <div class="detail-content">
                  <div class="review-context mb-16">
                     <h3 class="mt-0 mb-1">{{row.employeeName}}</h3>
                     <p class="text-secondary">{{row.goalTitle}}</p>
                  </div>

                  <div class="self-review-summary mb-16">
                     <h4>Employee's Self Review</h4>
                     <p class="comments text-muted mt-1">{{row.selfReview || row.comments || 'No details provided.'}}</p>
                  </div>

                  <mat-divider class="my-3"></mat-divider>

                   <div class="manager-evaluation">
                      <h4>Your Evaluation</h4>
                      <div *ngIf="row.status !== 'EMPLOYEE_SUBMITTED'" class="completed-eval">
                          <div class="rating-display">
                            <strong>Rating:</strong> <span>{{row.rating}}/5</span>
                          </div>
                          <p><strong>Your Feedback:</strong> {{row.managerFeedback || row.reviewerFeedback || 'Summary provided.'}}</p>
                      </div>

                      <form *ngIf="row.status === 'EMPLOYEE_SUBMITTED'" [formGroup]="getFeedbackForm(row.id)" (ngSubmit)="submitFeedback(row.id)" class="feedback-form">
                          <div class="rating-selector mb-16">
                            <label>Rating (1-5):</label>
                            <div class="slider-group">
                              <mat-slider min="1" max="5" step="1" showTickMarks discrete>
                                <input matSliderThumb formControlName="rating">
                              </mat-slider>
                              <span class="selected-rate">{{getFeedbackForm(row.id).get('rating')?.value}}</span>
                            </div>
                          </div>

                          <mat-form-field appearance="outline" class="full-width">
                             <mat-label>Constructive Feedback</mat-label>
                             <textarea matInput formControlName="feedback" rows="4" placeholder="Provide actionable feedback..."></textarea>
                          </mat-form-field>
                          
                          <div class="form-actions">
                             <button mat-raised-button color="primary" type="submit" [disabled]="getFeedbackForm(row.id).invalid">
                                Submit Final Review
                             </button>
                          </div>
                      </form>
                   </div>
               </div>

            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumnsWithExpand"></tr>
        <tr mat-row *matRowDef="let element; columns: displayedColumnsWithExpand;"
            class="element-row"
            [class.expanded-row]="expandedElement === element"
            (click)="expandedElement = expandedElement === element ? null : element">
        </tr>
        <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row"></tr>
        
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="5">No team performance records found.</td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25]" aria-label="Select page of team performance"></mat-paginator>
    </div>
  `,
  styleUrls: ['./team-performance.component.scss'],
  styles: [`
    .rating-selector { display: flex; flex-direction: column; gap: 8px; }
    .slider-group { display: flex; align-items: center; gap: 16px; }
    .selected-rate { font-size: 1.5em; font-weight: bold; color: #3f51b5; min-width: 24px; text-align: center; }
    .completed-eval { padding: 12px; background: #f5f5f5; border-radius: 8px; }
    .rating-display { margin-bottom: 8px; font-size: 1.1em; }
    .status-badge.pending { background: #fff3e0; color: #e65100; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
    .status-badge.completed { background: #e8f5e9; color: #2e7d32; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
    .status-badge.employee_submitted { background: #e3f2fd; color: #1565c0; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
    .mb-16 { margin-bottom: 16px; }
    .mb-8 { margin-bottom: 8px; }
    .text-secondary { color: rgba(0,0,0,0.54); }
    .text-muted { color: #666; }
  `],
})
export class TeamPerformanceComponent implements OnInit {
  displayedColumns: string[] = ['employeeName', 'goalTitle', 'status'];
  displayedColumnsWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: PerformanceReview | null = null;

  dataSource: MatTableDataSource<PerformanceReview> = new MatTableDataSource();
  feedbackForms: { [key: number]: FormGroup } = {};
  managerId: number = 2; // Default for manager portal demo
  allEmployees: Employee[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private performanceService: PerformanceService,
    private authService: AuthService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    const user = this.authService.currentUserValue;
    if (user) this.managerId = user.id || 2;
  }

  ngOnInit(): void {
    this.loadTeamReviews();
  }

  loadTeamReviews() {
    this.employeeService.getAllEmployees().subscribe({
      next: (emps: Employee[]) => {
        this.allEmployees = emps;
        this.fetchReviewsPerReport();
      },
      error: (err: any) => {
        console.error('Failed to load employees for mapping', err);
        this.fetchReviewsPerReport(); // Try anyway
      }
    });
  }

  private fetchReviewsPerReport() {
    // const myReports = this.allEmployees.filter(e => e.managerId === this.managerId);
    const myReports = this.allEmployees;
    if (myReports.length === 0) {
      this.updateDataSource([]);
      return;
    }

    const allReviews: PerformanceReview[] = [];
    let processed = 0;

    myReports.forEach((report: Employee) => {
      // Use userId for fetching history if it exists, otherwise fallback to id
      // const targetId = report.userId || report.id;
      const targetId = report.id;

      if (targetId) {
        this.performanceService.getHistory(targetId).subscribe({
          next: (reviews: PerformanceReview[]) => {
            // Filter for EMPLOYEE_SUBMITTED status
            const pendingReviews = reviews.filter(r => r.status === 'EMPLOYEE_SUBMITTED');

            pendingReviews.forEach(r => {
              // Enrich with Employee Name from our report object
              r.employeeName = `${report.firstName} ${report.lastName}`;

              // Enrich with Goal Title (fallback to cycle)
              r.goalTitle = r.reviewCycle || 'Performance Review';

              allReviews.push(r);
            });

            processed++;
            if (processed === myReports.length) {
              this.updateDataSource(allReviews);
            }
          },
          error: (err) => {
            console.error(`Failed to load history for ${report.firstName}`, err);
            processed++;
            if (processed === myReports.length) {
              this.updateDataSource(allReviews);
            }
          }
        });
      } else {
        processed++;
      }
    });
  }

  updateDataSource(reviews: PerformanceReview[]) {
    this.dataSource = new MatTableDataSource(reviews);
    reviews.forEach(r => {
      if (r.id && !r.reviewerFeedback) {
        this.feedbackForms[r.id] = this.fb.group({
          feedback: ['', Validators.required],
          rating: [4, [Validators.required, Validators.min(1), Validators.max(5)]]
        });
      }
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getFeedbackForm(id: number | undefined): FormGroup {
    if (!id || !this.feedbackForms[id]) return this.fb.group({ feedback: [''], rating: [3] });
    return this.feedbackForms[id];
  }

  submitFeedback(reviewId: number | undefined) {
    if (!reviewId) return;
    const form = this.getFeedbackForm(reviewId);
    if (form.invalid) return;

    const feedbackText = form.get('feedback')?.value;
    const rating = form.get('rating')?.value;

    this.performanceService.provideManagerFeedback(reviewId, this.managerId, feedbackText, rating).subscribe({
      next: () => {
        this.snackBar.open('Feedback submitted successfully', 'Close', { duration: 3000 });
        this.expandedElement = null;
        this.loadTeamReviews();
      },
      error: (err: any) => {
        console.error('Error submitting feedback', err);
        this.snackBar.open('Failed to submit feedback', 'Close', { duration: 3000 });
      }
    });
  }
}
