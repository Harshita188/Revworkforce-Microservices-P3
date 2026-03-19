import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-leave-apply',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule,
    MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <h1>Apply for Leave</h1>
      
      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="leaveForm" (ngSubmit)="onSubmit()">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Leave Type</mat-label>
              <mat-select formControlName="leaveType">
                <mat-option value="ANNUAL">Annual Leave</mat-option>
                <mat-option value="SICK">Sick Leave</mat-option>
                <mat-option value="MATERNITY">Maternity Leave</mat-option>
                <mat-option value="PATERNITY">Paternity Leave</mat-option>
                <mat-option value="UNPAID">Unpaid Leave</mat-option>
              </mat-select>
              <mat-error *ngIf="leaveForm.get('leaveType')?.hasError('required')">Type is required</mat-error>
            </mat-form-field>

            <div class="date-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Start Date</mat-label>
                <input matInput [matDatepicker]="startPicker" formControlName="startDate">
                <mat-datepicker-toggle matIconSuffix [for]="startPicker"></mat-datepicker-toggle>
                <mat-datepicker #startPicker></mat-datepicker>
                <mat-error *ngIf="leaveForm.get('startDate')?.hasError('required')">Start date required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>End Date</mat-label>
                <input matInput [matDatepicker]="endPicker" formControlName="endDate">
                <mat-datepicker-toggle matIconSuffix [for]="endPicker"></mat-datepicker-toggle>
                <mat-datepicker #endPicker></mat-datepicker>
                <mat-error *ngIf="leaveForm.get('endDate')?.hasError('required')">End date required</mat-error>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Reason for Leave</mat-label>
              <textarea matInput formControlName="reason" rows="4" placeholder="Briefly explain why you need this leave..."></textarea>
              <mat-error *ngIf="leaveForm.get('reason')?.hasError('required')">Reason is required</mat-error>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="leaveForm.invalid || isLoading">
                Submit Application
              </button>
            </div>

          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./leave-apply.component.scss']
})
export class LeaveApplyComponent implements OnInit {
  leaveForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.leaveForm = this.fb.group({
      leaveType: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit() {
    if (this.leaveForm.invalid) return;

    // For now we will mock the employee ID. In a real scenario, fetch this from the logged in user profile.
    const employeeId = 1;

    const formValues = this.leaveForm.value;
    const leaveRequest: LeaveRequest = {
      employeeId: employeeId,
      leaveType: formValues.leaveType,
      // Convert dates to YYYY-MM-DD
      startDate: this.formatDate(formValues.startDate),
      endDate: this.formatDate(formValues.endDate),
      reason: formValues.reason,
      //status: 'PENDING'
    };

    this.isLoading = true;
    this.leaveService.applyForLeave(leaveRequest).subscribe({
      next: () => {
        this.snackBar.open('Leave application submitted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/my-leaves/history']);
      },
      error: (err) => {
        console.error('Submit leave error:', err);
        // Fallback for development if APIs aren't fully seeded
        this.snackBar.open('Mock submitted - backend failed', 'Close', { duration: 3000 });
        this.router.navigate(['/my-leaves/history']);
        this.isLoading = false;
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}
