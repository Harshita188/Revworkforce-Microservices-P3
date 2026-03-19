import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { EmployeeService } from '../../../core/services/employee.service';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';
import { AuthService } from '../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <h1>Manager Dashboard</h1>
      
      <div class="kpi-row">
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">groups</mat-icon>
            <mat-card-title>{{teamSize}}</mat-card-title>
            <mat-card-subtitle>Team Members</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        
        <mat-card class="kpi-card">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">pending_actions</mat-icon>
            <mat-card-title>{{pendingApprovals}}</mat-card-title>
            <mat-card-subtitle>Pending Leave Approvals</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>

      <div class="actions-row">
        <mat-card class="action-card">
          <mat-card-header>
             <mat-card-title>Quick Actions</mat-card-title>
          </mat-card-header>
          <mat-card-content class="action-buttons">
             <button mat-raised-button color="primary" routerLink="/leave-approvals">
               <mat-icon>fact_check</mat-icon> Review Leaves
             </button>
             <button mat-raised-button color="accent" routerLink="/team-performance">
               <mat-icon>assessment</mat-icon> Give Feedback
             </button>
             <button mat-stroked-button color="primary" routerLink="/employees">
               <mat-icon>people</mat-icon> View Team
             </button>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./manager-dashboard.component.scss']
})
export class ManagerDashboardComponent implements OnInit {
  teamSize = 0;
  pendingApprovals = 0;

  constructor(
    private employeeService: EmployeeService,
    private leaveService: LeaveService,
    private authService: AuthService
  ) { }

  // ngOnInit(): void {
  //     // Mock data processing for now until full backend hookup is robust
  //     this.teamSize = 12;
  //     this.pendingApprovals = 3;

  //     /* In a real scenario, fetch actual team and leaves
  //     const userId = this.authService.currentUserValue?.id;
  //     // Get manager's employee record first, then fetch team by managerId
  //     */
  // }
  ngOnInit(): void {

    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.teamSize = data.length;
      }
    });

    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => {
        this.pendingApprovals = data.length;
      }
    });

  }
}
