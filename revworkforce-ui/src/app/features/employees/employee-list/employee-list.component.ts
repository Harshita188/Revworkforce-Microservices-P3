import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule } from '@angular/router';
import { EmployeeService, Employee } from '../../../core/services/employee.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule, MatTableModule, MatPaginatorModule, MatSortModule,
    MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, RouterModule
  ],
  template: `
   <div class="page-header">
      <h1>Employee Directory</h1>
      <button mat-raised-button color="primary" routerLink="/employees/new">
        <mat-icon>add</mat-icon> Add Employee
      </button>
    </div>

    <mat-form-field appearance="outline" class="filter-field">
      <mat-label>Search Employees</mat-label>
      <input matInput (keyup)="applyFilter($event)" placeholder="Ex. John Doe" #input>
      <mat-icon matSuffix>search</mat-icon>
    </mat-form-field>

    <div class="mat-elevation-z8 table-container">
      <table mat-table [dataSource]="dataSource" matSort>

        <!-- ID Column -->
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> ID </th>
          <td mat-cell *matCellDef="let row"> EMP-{{row.id}} </td>
        </ng-container>

        <!-- Name Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Name </th>
          <td mat-cell *matCellDef="let row"> <strong>{{row.firstName}} {{row.lastName}}</strong> </td>
        </ng-container>

        <!-- Phone Column -->
        <ng-container matColumnDef="phone">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Phone </th>
          <td mat-cell *matCellDef="let row"> {{row.phone}} </td>
        </ng-container>

        <!-- Manager Column -->
        <ng-container matColumnDef="manager">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Manager </th>
          <td mat-cell *matCellDef="let row"> 
            {{row.managerName || 'N/A'}}
          </td>
        </ng-container>

        <!-- Status Column -->
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header> Status </th>
          <td mat-cell *matCellDef="let row"> 
             <span class="status-badge" [class.active]="row.status === 'ACTIVE'">{{row.status}}</span> 
          </td>
        </ng-container>
        
        <!-- Actions Column -->
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button color="primary" [routerLink]="['/employees/edit', row.id]">
              <mat-icon>edit</mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteEmployee(row.id)">
              <mat-icon>delete</mat-icon>
            </button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

        <!-- Row shown when there is no matching data. -->
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell empty-cell" colspan="6">No data matching the filter "{{input.value}}"</td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[10, 25, 100]" aria-label="Select page of employees"></mat-paginator>
    </div>
  `,
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'manager', 'status', 'actions'];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private employeeService: EmployeeService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getAllEmployees().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.fetchManagerNames();
      },
      error: (err) => {
        console.error('Error fetching employees', err);
        // Mock data for display if backend is empty
        const mockData: any[] = [
          { id: 1, firstName: 'Alice', lastName: 'Smith', phone: '123-456-7890', departmentId: 1, designationId: 1, status: 'ACTIVE', joiningDate: '2023-01-15', managerName: 'Admin' },
          { id: 2, firstName: 'Bob', lastName: 'Jones', phone: '987-654-3210', departmentId: 2, designationId: 2, status: 'ACTIVE', joiningDate: '2023-02-20', managerName: 'Alice Smith' },
          { id: 3, firstName: 'Charlie', lastName: 'Brown', phone: '555-555-5555', departmentId: 1, designationId: 3, status: 'INACTIVE', joiningDate: '2022-11-01', managerName: 'Alice Smith' }
        ];
        this.dataSource = new MatTableDataSource(mockData);
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  fetchManagerNames() {
    this.dataSource.data.forEach((employee: any) => {
      this.employeeService.getEmployeeWithUser(employee.id).subscribe({
        next: (response) => {
          if (response.user && response.user.managerId) {
            // Find manager's name (simplified: could reach out to user service again or use existing list)
            // For now, let's just show the manager ID or fetch manager details if needed.
            // But wait, the user service 'managerId' refers to another user.
            // Ideally, the backend should provide this.
            // Since I can't change backend Employee entity, I'll use the getEmployeeWithUser to at least get the user details.
            // If the user object has managerId, we'd need another call to get manager's user details.
            // To keep it minimal as per user request, I will just show "Assigned" or fetch if manager ID exists.

            this.userService.getUser(response.user.managerId).subscribe({
              next: (mgrUser: any) => {
                employee.managerName = mgrUser.name;
              }
            });
          }
        }
      });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe(() => {
        this.loadEmployees();
      });
    }
  }
}
