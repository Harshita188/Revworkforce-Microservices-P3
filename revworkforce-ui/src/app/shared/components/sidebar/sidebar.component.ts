import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <div class="sidebar-header">
      <h2>RevWorkforce</h2>
    </div>
    <mat-nav-list>
      <a mat-list-item *ngFor="let item of menuItems" [routerLink]="item.route" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
        <div matListItemTitle>{{ item.label }}</div>
      </a>
    </mat-nav-list>
  `,
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: { label: string, route: string, icon: string }[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const role = this.authService.currentUserValue?.role;
    
    // Base items for everyone
    if (role === 'ADMIN') {
        this.menuItems = [
            { label: 'Dashboard', route: '/admin-dashboard', icon: 'dashboard' },
            { label: 'Employees', route: '/employees', icon: 'badge' },
            { label: 'Leave Requests', route: '/leave-approvals', icon: 'fact_check' },
            { label: 'Performance', route: '/team-performance', icon: 'assessment' },
            { label: 'Create Goal', route: '/goals/new', icon: 'outlined_flag' },
            { label: 'Change Password', route: '/change-password', icon: 'lock_reset' },
            { label: 'Notifications', route: '/notifications', icon: 'notifications' }
        ];
    } else if (role === 'MANAGER') {
        this.menuItems = [
            { label: 'Dashboard', route: '/manager-dashboard', icon: 'dashboard' },
            { label: 'Team Directory', route: '/employees', icon: 'groups' },
            { label: 'Leave Requests', route: '/leave-approvals', icon: 'fact_check' },
            { label: 'Team Performance', route: '/team-performance', icon: 'assessment' },
            { label: 'Create Goal', route: '/goals/new', icon: 'outlined_flag' },
            { label: 'Change Password', route: '/change-password', icon: 'lock_reset' },
            { label: 'Notifications', route: '/notifications', icon: 'notifications' }
        ];
    } else {
        this.menuItems = [
            { label: 'Dashboard', route: '/employee-dashboard', icon: 'dashboard' },
            { label: 'Apply Leave', route: '/my-leaves', icon: 'event_busy' },
            { label: 'Leave History', route: '/my-leaves/history', icon: 'history' },
            { label: 'Self Review', route: '/my-performance', icon: 'edit_note' },
            { label: 'Change Password', route: '/change-password', icon: 'lock_reset' },
            { label: 'Notifications', route: '/notifications', icon: 'notifications' }
        ];
    }
  }
}
