import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule,
    MatSelectModule, MatButtonModule, MatIconModule, RouterModule, MatSnackBarModule
  ],
  template: `
    <div class="form-container">
      <div class="page-header">
        <h1>{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h1>
        <button mat-icon-button routerLink="/employees" aria-label="Go back">
          <mat-icon>arrow_back</mat-icon>
        </button>
      </div>

      <mat-card class="form-card">
        <mat-card-content>
          <form [formGroup]="employeeForm" (ngSubmit)="onSubmit()">
            
            <div class="form-row two-cols">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>First Name</mat-label>
                <input matInput formControlName="firstName" placeholder="Ex. Jane">
                <mat-error *ngIf="employeeForm.get('firstName')?.hasError('required')">First name is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Last Name</mat-label>
                <input matInput formControlName="lastName" placeholder="Ex. Doe">
                <mat-error *ngIf="employeeForm.get('lastName')?.hasError('required')">Last name is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-cols">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Phone Number</mat-label>
                <input matInput formControlName="phone" placeholder="Ex. 555-123-4567">
                <mat-error *ngIf="employeeForm.get('phone')?.hasError('required')">Phone is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Joining Date</mat-label>
                <input matInput formControlName="joiningDate" type="date">
                <mat-error *ngIf="employeeForm.get('joiningDate')?.hasError('required')">Joining date is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row two-cols">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Department ID</mat-label>
                <input matInput type="number" formControlName="departmentId">
                <mat-error *ngIf="employeeForm.get('departmentId')?.hasError('required')">Department is required</mat-error>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Designation ID</mat-label>
                <input matInput type="number" formControlName="designationId">
                <mat-error *ngIf="employeeForm.get('designationId')?.hasError('required')">Designation is required</mat-error>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="ACTIVE">Active</mat-option>
                  <mat-option value="INACTIVE">Inactive</mat-option>
                  <mat-option value="ON_LEAVE">On Leave</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="actions">
              <button mat-button type="button" routerLink="/employees">Cancel</button>
              <button mat-raised-button color="primary" type="submit" [disabled]="employeeForm.invalid || isLoading">
                {{ isEditMode ? 'Update' : 'Save' }} Employee
              </button>
            </div>
            
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: number | null = null;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      departmentId: ['', [Validators.required, Validators.min(1)]],
      designationId: ['', [Validators.required, Validators.min(1)]],
      joiningDate: ['', Validators.required],
      status: ['ACTIVE', Validators.required]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.employeeId = +idParam;
      this.loadEmployee(this.employeeId);
    }
  }

  loadEmployee(id: number) {
    this.employeeService.getEmployeeById(id).subscribe({
      next: (emp) => {
        this.employeeForm.patchValue(emp);
      },
      error: (err) => {
        this.snackBar.open('Error loading employee data', 'Close', { duration: 3000 });
      }
    });
  }

  onSubmit() {
    if (this.employeeForm.invalid) return;

    this.isLoading = true;
    const employeeData: Employee = this.employeeForm.value;

    if (this.isEditMode && this.employeeId) {
      this.employeeService.updateEmployee(this.employeeId, employeeData).subscribe({
        next: () => {
          this.snackBar.open('Employee updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.snackBar.open('Failed to update employee', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    } else {
      this.employeeService.createEmployee(employeeData).subscribe({
        next: () => {
          this.snackBar.open('Employee created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/employees']);
        },
        error: () => {
          this.snackBar.open('Failed to create employee', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
    }
  }
}
