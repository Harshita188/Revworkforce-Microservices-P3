import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';

@Component({
  selector: 'app-leave-history',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, RouterModule
  ],
  template: `
    <div class="page-header">
      <h1>My Leave History</h1>
      <button mat-raised-button color="primary" routerLink="/my-leaves">
        <mat-icon>add</mat-icon> Apply Leave
      </button>
    </div>

    <div class="mat-elevation-z8 table-container">
      <table mat-table [dataSource]="dataSource" matSort>

        <!-- Type Column -->
        <ng-container matColumnDef="leaveType">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
          <td mat-cell *matCellDef="let row"> {{row.leaveType}} </td>
        </ng-container>

        <!-- Start Date Column -->
        <ng-container matColumnDef="startDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Start Date </th>
          <td mat-cell *matCellDef="let row"> {{row.startDate | date}} </td>
        </ng-container>

        <!-- End Date Column -->
        <ng-container matColumnDef="endDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> End Date </th>
          <td mat-cell *matCellDef="let row"> {{row.endDate | date}} </td>
        </ng-container>

        <!-- Reason Column -->
        <ng-container matColumnDef="reason">
          <th mat-header-cell *matHeaderCellDef> Reason </th>
          <td mat-cell *matCellDef="let row"> 
             <span class="truncate-text" [title]="row.reason">{{row.reason}}</span> 
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let row"> 
             <span class="status-badge" [ngClass]="row.status.toLowerCase()">{{row.status}}</span> 
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="5">No leave history found.</td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[5, 10, 25]" aria-label="Select page of leaves"></mat-paginator>
    </div>
  `,
  styleUrls: ['./leave-history.component.scss']
})
export class LeaveHistoryComponent implements OnInit {
  displayedColumns: string[] = ['leaveType', 'startDate', 'endDate', 'reason', 'status'];
  dataSource: MatTableDataSource<LeaveRequest> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private leaveService: LeaveService) { }

  ngOnInit(): void {
    // Hardcoded employee ID 1 for now
    this.leaveService.getMyLeaves(1).subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data as LeaveRequest[]);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Failed to load leaves', err);
        // Mock data
        const mockData: LeaveRequest[] = [
          { id: 101, employeeId: 1, leaveType: 'ANNUAL', startDate: '2024-01-10', endDate: '2024-01-15', reason: 'Vacation' },
          { id: 102, employeeId: 1, leaveType: 'SICK', startDate: '2024-03-05', endDate: '2024-03-06', reason: 'Flu' },
          { id: 103, employeeId: 1, leaveType: 'ANNUAL', startDate: '2023-12-20', endDate: '2023-12-31', reason: 'Holidays' }
        ];
        this.dataSource = new MatTableDataSource(mockData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }
}
