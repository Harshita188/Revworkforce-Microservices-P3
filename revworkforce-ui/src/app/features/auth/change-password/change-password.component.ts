import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, 
    MatButtonModule, MatIconModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Change Password</h1>
      </div>

      <mat-card class="password-card">
        <mat-card-content>
          <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()">
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Current Password</mat-label>
              <input matInput [type]="hideCurrent ? 'password' : 'text'" formControlName="currentPassword">
              <button mat-icon-button matSuffix (click)="hideCurrent = !hideCurrent" type="button">
                <mat-icon>{{hideCurrent ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>New Password</mat-label>
              <input matInput [type]="hideNew ? 'password' : 'text'" formControlName="newPassword">
              <button mat-icon-button matSuffix (click)="hideNew = !hideNew" type="button">
                <mat-icon>{{hideNew ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              <mat-hint>Minimum 6 characters</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm New Password</mat-label>
              <input matInput [type]="hideConfirm ? 'password' : 'text'" formControlName="confirmPassword">
              <button mat-icon-button matSuffix (click)="hideConfirm = !hideConfirm" type="button">
                <mat-icon>{{hideConfirm ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <div class="actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="passwordForm.invalid || isLoading">
                Update Password
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .page-container { padding: 24px; max-width: 500px; margin: 0 auto; }
    .page-header { margin-bottom: 24px; text-align: center; }
    .password-card { padding: 16px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .actions { margin-top: 16px; display: flex; justify-content: flex-end; }
  `]
})
export class ChangePasswordComponent {
  passwordForm: FormGroup;
  hideCurrent = true;
  hideNew = true;
  hideConfirm = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  onSubmit() {
    if (this.passwordForm.invalid) return;

    this.isLoading = true;
    const { currentPassword, newPassword } = this.passwordForm.value;

    this.authService.changePassword(currentPassword, newPassword).subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/dashboard']);
      },
      error: (err: any) => {
        const errorMsg = err.error?.message || 'Failed to change password. Please check your current password.';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        this.isLoading = false;
      }
    });
  }
}
