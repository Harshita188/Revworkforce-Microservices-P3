import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { MatDividerModule } from '@angular/material/divider';


@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule, RouterModule, MatDividerModule],
  template: `
    <mat-toolbar color="primary" class="topbar">
      <button mat-icon-button (click)="toggleSidebar.emit()">
        <mat-icon>menu</mat-icon>
      </button>
      
      <span class="spacer"></span>
     
      <!-- User Profile -->
      <button mat-button [matMenuTriggerFor]="userMenu" class="user-button">
        <mat-icon>account_circle</mat-icon>
        <span class="username">{{ userName }}</span>
      </button>
      <mat-menu #userMenu="matMenu">
        <button mat-menu-item (click)="logout()">
          <mat-icon>exit_to_app</mat-icon>
          <span>Logout</span>
        </button>
      </mat-menu>
    </mat-toolbar>
  `,
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();
  userName = 'User';
  notifications: any[] = [];
  unreadCount = 0;


  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userName = user.name || user.email;
      // if we have a real employee ID we could fetch notifications here.
      // For now mock or fetch if logic is complete:
      if (user.id) {
        this.notificationService.getNotifications(user.id).subscribe(res => {
          this.notifications = res;
          // Assuming Notification interface has a 'read' property
          this.unreadCount = res.filter((n: any) => !n.read).length;
        });
      }
    }
  }

  logout() {
    this.authService.logout();
  }
}
