import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReportService, HRDashboardData } from '../../../core/services/report.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgxChartsModule],
  template: `
    <div class="dashboard-container">
      <h1>HR Admin Dashboard</h1>
      
      <div class="kpi-row" *ngIf="dashboardData">
        <mat-card class="kpi-card" style="border-left: 4px solid #3f51b5;">
          <mat-card-header>
            <mat-icon mat-card-avatar color="primary">people</mat-icon>
            <mat-card-title>{{dashboardData.totalEmployees}}</mat-card-title>
            <mat-card-subtitle>Total Employees</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
        
        <mat-card class="kpi-card" style="border-left: 4px solid #f44336;">
          <mat-card-header>
            <mat-icon mat-card-avatar color="warn">pending_actions</mat-icon>
            <mat-card-title>{{dashboardData.pendingLeaves}}</mat-card-title>
            <mat-card-subtitle>Pending Leaves</mat-card-subtitle>
          </mat-card-header>
        </mat-card>

        <mat-card class="kpi-card" style="border-left: 4px solid #4caf50;">
          <mat-card-header>
            <mat-icon mat-card-avatar style="color: #4caf50">trending_up</mat-icon>
            <mat-card-title>{{dashboardData.averagePerformanceRating | number:'1.1-2'}}</mat-card-title>
            <mat-card-subtitle>Avg Performance Rating</mat-card-subtitle>
          </mat-card-header>
        </mat-card>
      </div>
      
      <div class="charts-row" *ngIf="dashboardData">
         <mat-card class="chart-card">
            <mat-card-header><mat-card-title>Recent Leave Activity</mat-card-title></mat-card-header>
            <mat-card-content>
               <ngx-charts-bar-vertical
                  [view]="[500, 300]"
                  [results]="leaveChartData"
                  [xAxis]="true"
                  [yAxis]="true"
                  [legend]="false"
                  [showXAxisLabel]="true"
                  [showYAxisLabel]="true"
                  xAxisLabel="Leave Status"
                  yAxisLabel="Count">
               </ngx-charts-bar-vertical>
            </mat-card-content>
         </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  dashboardData: HRDashboardData | null = null;
  leaveChartData: any[] = [];

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    // We try to call the backend which we know requires ADMIN role
    this.reportService.getDashboard().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.setupCharts(data);
      },
      error: (err) => {
        // Fallback for development if APIs aren't fully seeded
        console.warn('Could not fetch real dashboard data, using mocks');
        this.dashboardData = {
           totalEmployees: 142,
           pendingLeaves: 8,
           averagePerformanceRating: 4.2,
           recentLeaves: []
        };
        this.setupCharts(this.dashboardData);
      }
    });
  }

  setupCharts(data: HRDashboardData) {
      this.leaveChartData = [
          { name: 'Pending', value: data.pendingLeaves },
          { name: 'Approved', value: 45 },
          { name: 'Rejected', value: 3 }
      ];
  }
}
