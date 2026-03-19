import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PerformanceService } from '../../../core/services/performance.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/core.models';
import { EmployeeService, Employee } from '../../../core/services/employee.service';


@Component({
  selector: 'app-goal-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule,
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="goal-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Create New Goal</mat-card-title>
          <mat-card-subtitle>Assign a performance goal to an employee.</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="goalForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Select Employee</mat-label>
                <mat-select formControlName="employeeId">
                  <mat-option *ngFor="let user of employees" [value]="user.id">
  {{user.firstName}} {{user.lastName}} (ID: {{user.id}})
</mat-option>
                </mat-select>
                <mat-error *ngIf="goalForm.get('employeeId')?.hasError('required')">Required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Goal Title</mat-label>
                <input matInput formControlName="title" placeholder="Ex. Master Angular 17">
                <mat-error *ngIf="goalForm.get('title')?.hasError('required')">Required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Description</mat-label>
                <textarea matInput formControlName="description" rows="3" placeholder="Explain the expectations..."></textarea>
                <mat-error *ngIf="goalForm.get('description')?.hasError('required')">Required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-cols">
              <mat-form-field appearance="outline">
                <mat-label>Target Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="targetDate">
                <mat-hint>MM/DD/YYYY</mat-hint>
                <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="goalForm.get('targetDate')?.hasError('required')">Required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Initial Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="NOT_STARTED">Not Started</mat-option>
                  <mat-option value="IN_PROGRESS">In Progress</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="goalForm.invalid || isLoading">
                <mat-icon *ngIf="!isLoading">flag</mat-icon>
                <span *ngIf="!isLoading">Create Goal</span>
                <span *ngIf="isLoading">Creating...</span>
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .goal-form-container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .full-width { width: 100%; }
    .two-cols { display: flex; gap: 16px; }
    .two-cols mat-form-field { flex: 1; }
    .form-row { margin-bottom: 16px; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 16px; }
  `]
})
export class GoalFormComponent implements OnInit {
  goalForm: FormGroup;
  employees: Employee[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private performanceService: PerformanceService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private snackBar: MatSnackBar
  ) {
    this.goalForm = this.fb.group({
      employeeId: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      targetDate: ['', Validators.required],
      status: ['NOT_STARTED', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  // loadEmployees(): void {
  //   this.userService.getUsers().subscribe({
  //     next: (users) => {
  //       // In a real app, we might filter to show only direct reports
  //       this.employees = users;
  //     },
  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.snackBar.open('Error loading employee list', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.isLoading = true;
      const formValue = this.goalForm.value;

      // Format date to ISO string if needed by backend
      const goalData = {
        ...formValue,
        targetDate: new Date(formValue.targetDate).toISOString().split('T')[0],
        progress: 0
      };

      this.performanceService.addGoal(goalData).subscribe({
        next: () => {
          this.snackBar.open('Goal created successfully', 'Close', { duration: 3000 });
          this.goalForm.reset({ status: 'NOT_STARTED' });
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error creating goal', err);
          this.snackBar.open('Failed to create goal', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
