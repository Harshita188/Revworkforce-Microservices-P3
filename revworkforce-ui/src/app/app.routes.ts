import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/public/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'admin-dashboard',
        loadComponent: () => import('./features/dashboard/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'manager-dashboard',
        loadComponent: () => import('./features/dashboard/manager-dashboard/manager-dashboard.component').then(m => m.ManagerDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
      },
      {
        path: 'employee-dashboard',
        loadComponent: () => import('./features/dashboard/employee-dashboard/employee-dashboard.component').then(m => m.EmployeeDashboardComponent),
        canActivate: [RoleGuard],
        data: { roles: ['EMPLOYEE', 'MANAGER', 'ADMIN'] }
      },
      // Employee Management
      {
        path: 'employees',
        loadComponent: () => import('./features/employees/employee-list/employee-list.component').then(m => m.EmployeeListComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] } // HR admins and managers can view
      },
      {
        path: 'employees/new',
        loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      {
        path: 'employees/edit/:id',
        loadComponent: () => import('./features/employees/employee-form/employee-form.component').then(m => m.EmployeeFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN'] }
      },
      // Leave Management
      {
        path: 'my-leaves',
        loadComponent: () => import('./features/leaves/leave-apply/leave-apply.component').then(m => m.LeaveApplyComponent)
      },
      {
        path: 'my-leaves/history',
        loadComponent: () => import('./features/leaves/leave-history/leave-history.component').then(m => m.LeaveHistoryComponent)
      },
      {
        path: 'leave-approvals',
        loadComponent: () => import('./features/leaves/leave-approvals/leave-approvals.component').then(m => m.LeaveApprovalsComponent),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'MANAGER'] }
      },
      // Performance Management
      {
        path: 'my-performance',
        loadComponent: () => import('./features/performance/my-performance/my-performance.component').then(m => m.MyPerformanceComponent)
      },
      {
        path: 'team-performance',
        loadComponent: () => import('./features/performance/team-performance/team-performance.component').then(m => m.TeamPerformanceComponent),
        canActivate: [RoleGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
      },
      {
        path: 'goals/new',
        loadComponent: () => import('./features/performance/goal-form/goal-form.component').then(m => m.GoalFormComponent),
        canActivate: [RoleGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
      },
      // Notifications
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notification-list/notification-list.component').then(m => m.NotificationListComponent)
      },
      // Change Password
      {
        path: 'change-password',
        loadComponent: () => import('./features/auth/change-password/change-password.component').then(m => m.ChangePasswordComponent)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
