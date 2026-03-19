import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterModule } from '@angular/router';
import { LeaveService, LeaveBalance, LeaveRequest } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="header-section">
        <h1>My Workspace</h1>
        <p class="subtitle">Welcome back! Here's your overview.</p>
      </div>
      
      <div class="kpi-row">
        <!-- Mock Leave Balances -->
        <mat-card class="kpi-card" *ngFor="let balance of balances">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">event</mat-icon>
            <mat-card-title>{{ balance.balance }} / {{ balance.totalDays }}</mat-card-title>
            <mat-card-subtitle>{{ balance.leaveType }} Remaining</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <mat-progress-bar mode="determinate" [value]="(balance.usedDays / balance.totalDays) * 100"></mat-progress-bar>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="actions-row">
        <!-- New Pending Leaves Widget -->
        <mat-card class="action-card flex-2">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">pending_actions</mat-icon>
            <mat-card-title>Pending Leave Requests</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="pendingLeaves.length > 0; else noPending" class="pending-list">
              <div class="pending-item" *ngFor="let leave of pendingLeaves">
                <div class="leave-info">
                  <strong>{{ leave.leaveType }}</strong>
                  <span>{{ leave.startDate | date:'shortDate' }} - {{ leave.endDate | date:'shortDate' }}</span>
                </div>
                <span class="status-pill pending">{{ leave.status || 'PENDING' }}</span>
              </div>
            </div>
            <ng-template #noPending>
              <p class="empty-msg">No pending leave requests found.</p>
            </ng-template>
          </mat-card-content>
          <mat-card-actions align="end">
            <button mat-button color="primary" routerLink="/my-leaves/history">Manage All</button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="action-card flex-1">
          <mat-card-header>
             <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content class="action-buttons vertical">
             <button mat-raised-button color="primary" routerLink="/my-leaves">
               <mat-icon>add_circle</mat-icon> Apply for Leave
             </button>
             <button mat-stroked-button color="accent" routerLink="/my-performance">
               <mat-icon>edit_note</mat-icon> Submit Self-Review
             </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 24px; }
    .header-section { margin-bottom: 32px; }
    .kpi-row { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 32px; }
    .kpi-card { flex: 1; min-width: 200px; }
    .actions-row { display: flex; gap: 24px; flex-wrap: wrap; }
    .action-card { min-width: 300px; flex: 1; }
    .flex-2 { flex: 2; }
    .flex-1 { flex: 1; }
    .action-buttons { display: flex; gap: 12px; flex-wrap: wrap; }
    .action-buttons.vertical { flex-direction: column; }
    .pending-list { display: flex; flex-direction: column; gap: 12px; margin-top: 16px; }
    .pending-item { 
      padding: 12px; 
      border-radius: 8px; 
      border: 1px solid #eee; 
      display: flex; 
      justify-content: space-between; 
      align-items: center;
      background: #fafafa;
    }
    .leave-info { display: flex; flex-direction: column; }
    .leave-info strong { font-size: 1.1em; color: #333; }
    .leave-info span { font-size: 0.9em; color: #666; }
    .status-pill { 
      padding: 4px 12px; 
      border-radius: 12px; 
      font-size: 0.8em; 
      font-weight: 500;
      text-transform: uppercase;
    }
    .status-pill.pending { background: #fff3e0; color: #e65100; }
    .empty-msg { color: #888; text-align: center; margin-top: 24px; }
  `],
})
export class EmployeeDashboardComponent implements OnInit {
  balances: LeaveBalance[] = [];
  pendingLeaves: any[] = [];
  employeeId: number = 1;

  constructor(
    private leaveService: LeaveService,
    private authService: AuthService
  ) {
    const user = this.authService.currentUserValue;
    if (user) {
      this.employeeId = user.id || 1;
    }
  }

  ngOnInit(): void {
    this.loadBalances();
    this.loadPendingLeaves();
  }

  // loadBalances() {
  //     this.leaveService.getBalances(this.employeeId).subscribe({
  //         next: (data) => this.balances = data,
  loadBalances() {
    this.leaveService.getBalances(this.employeeId).subscribe({
      next: (data: any[]) => {

        this.balances = data.map(b => ({
          employeeId: b.employeeId,
          leaveType: b.leaveType,
          totalDays: b.quota,
          usedDays: b.used,
          balance: b.quota - b.used
        }));

      },
      error: () => {
        // Mock fallback if service fails
        this.balances = [
          { employeeId: this.employeeId, leaveType: 'ANNUAL', totalDays: 20, usedDays: 8, balance: 12 },
          { employeeId: this.employeeId, leaveType: 'SICK', totalDays: 10, usedDays: 2, balance: 8 }
        ];
      }
    });
  }

  loadPendingLeaves() {
    this.leaveService.getHistory(this.employeeId).subscribe({
      next: (history: any[]) => {
        this.pendingLeaves = history.filter(l => l.status === 'PENDING');
      },
      error: (err) => {
        console.error('Failed to load pending leaves', err);
      }
    });
  }
}
