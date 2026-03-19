import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LeaveService, LeaveRequest } from '../../../core/services/leave.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { CommentDialogComponent } from './comment-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-leave-approvals',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatDialogModule,
    MatTooltipModule, CommentDialogComponent
  ],
  template: `
    <div class="page-header">
      <h1>Pending Leave Approvals</h1>
    </div>

    <div class="mat-elevation-z8 table-container">
      <table mat-table [dataSource]="dataSource" matSort>

        <!-- Employee Column -->
        <ng-container matColumnDef="employeeId">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Employee ID </th>
          <td mat-cell *matCellDef="let row"> EMP-{{row.employeeId}} </td>
        </ng-container>

        <!-- Type Column -->
        <ng-container matColumnDef="leaveType">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Type </th>
          <td mat-cell *matCellDef="let row"> {{row.leaveType}} </td>
        </ng-container>

        <!-- Dates Column -->
        <ng-container matColumnDef="dates">
          <th mat-header-cell *matHeaderCellDef> Dates </th>
          <td mat-cell *matCellDef="let row"> {{row.startDate | date}} - {{row.endDate | date}} </td>
        </ng-container>

        <!-- Reason Column -->
        <ng-container matColumnDef="reason">
          <th mat-header-cell *matHeaderCellDef> Reason </th>
          <td mat-cell *matCellDef="let row"> 
             <span class="truncate-text" [title]="row.reason">{{row.reason}}</span> 
          </td>
        </ng-container>

        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" (click)="processLeave(row.id, 'APPROVED')" matTooltip="Approve">
              <mat-icon>check_circle</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="processLeave(row.id, 'REJECTED')" matTooltip="Reject">
              <mat-icon>cancel</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="5">No pending leave requests found.</td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[10, 25, 50]" aria-label="Select page of approvals"></mat-paginator>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 24px; }
    .table-container { background: white; border-radius: 8px; overflow: hidden; }
    .truncate-text { display: block; max-width: 250px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .empty-cell { text-align: center; padding: 20px !important; }
  `]
})
export class LeaveApprovalsComponent implements OnInit {
  displayedColumns: string[] = ['employeeId', 'leaveType', 'dates', 'reason', 'actions'];
  dataSource: MatTableDataSource<LeaveRequest> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private leaveService: LeaveService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadPendingLeaves();
  }

  loadPendingLeaves() {
    this.leaveService.getPendingLeaves().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        console.error('Failed to load pending leaves', err);
        this.snackBar.open('Failed to load pending leaves', 'Close', { duration: 3000 });
      }
    });
  }

  processLeave(id: number | undefined, targetStatus: string) {
    if (!id) return;

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(comment => {
      if (comment === undefined) return; // User cancelled

      const managerId = this.authService.currentUserValue?.id || 1;

      this.leaveService.processLeaveRequest(id, targetStatus, managerId, comment || 'Decision made via HR Portal').subscribe({
        next: () => {
          this.snackBar.open(`Leave request ${targetStatus.toLowerCase()} successfully`, 'Close', { duration: 3000 });
          this.loadPendingLeaves();
        },
        error: (err) => {
          console.error('Error processing leave', err);
          this.snackBar.open('Failed to process leave request', 'Close', { duration: 3000 });
        }
      });
    });
  }
}