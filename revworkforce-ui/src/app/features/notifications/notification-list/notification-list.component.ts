import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    CommonModule, MatCardModule, MatIconModule, MatButtonModule, 
    MatDividerModule, MatBadgeModule
  ],
  template: `
    <div class="notifications-container">
      <div class="page-header">
        <h1>Notifications</h1>
        <button mat-stroked-button color="primary" (click)="markAllAsRead()" [disabled]="unreadCount === 0">
          Mark all as read
        </button>
      </div>

      <mat-card class="notifications-card">
        <mat-card-content *ngIf="filteredNotifications.length > 0; else noNotifications">
          <div class="notification-item" *ngFor="let notif of filteredNotifications; let last = last" 
               [class.unread]="!notif.read">
            
            <div class="notif-icon" [ngClass]="getIconClass(notif.type)">
               <mat-icon>{{getIcon(notif.type)}}</mat-icon>
            </div>
            
            <div class="notif-content">
               <p class="message">{{notif.message}}</p>
               <span class="time">{{notif.createdAt | date:'medium'}}</span>
            </div>

            <div class="notif-actions">
               <button mat-icon-button *ngIf="!notif.read" matTooltip="Mark as read" (click)="markAsRead(notif.id)">
                  <mat-icon>done</mat-icon>
               </button>
            </div>

            <mat-divider *ngIf="!last" class="notif-divider"></mat-divider>
          </div>
        </mat-card-content>
        
        <ng-template #noNotifications>
           <div class="empty-state">
              <mat-icon class="empty-icon">notifications_off</mat-icon>
              <p>You have no notifications at this time.</p>
           </div>
        </ng-template>
      </mat-card>
    </div>
  `,
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  unreadCount = 0;
  userId: number = 1;
  userRole: string = '';

  constructor(
      private notificationService: NotificationService,
      private authService: AuthService
  ) {
    const user = this.authService.currentUserValue;
    if (user) {
      this.userId = user.id || 1;
      this.userRole = user.role || '';
    }
  }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
      this.notificationService.getNotifications(this.userId).subscribe({
          next: (data) => {
              this.notifications = data;
              this.applyRoleFiltering();
              this.updateUnreadCount();
          },
          error: (err) => {
              console.error('Failed to load notifications', err);
              // Mock Data for demonstration
              this.notifications = [
                  { id: 1, recipientId: this.userId, message: 'Your leave request has been APPROVED.', type: 'LEAVE_APPROVED', read: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
                  { id: 2, recipientId: this.userId, message: 'Manager feedback available for Performance Review.', type: 'REVIEW_COMPLETED', read: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
                  { id: 3, recipientId: this.userId, message: 'Maintenance scheduled for this weekend.', type: 'SYSTEM_ALERT', read: false, createdAt: new Date(Date.now() - 172800000).toISOString() },
                  { id: 4, recipientId: this.userId, message: 'New employee onboarded.', type: 'SYSTEM_ALERT', read: false, createdAt: new Date().toISOString() }
              ];
              this.applyRoleFiltering();
              this.updateUnreadCount();
          }
      });
  }

  applyRoleFiltering() {
    if (this.userRole === 'ADMIN') {
      this.filteredNotifications = this.notifications.filter(n => 
        n.type === 'SYSTEM_ALERT' || !n.type.startsWith('LEAVE')
      );
    } else if (this.userRole === 'MANAGER') {
      this.filteredNotifications = this.notifications.filter(n => 
        n.type === 'REVIEW_COMPLETED' || n.type.startsWith('LEAVE')
      );
    } else {
      this.filteredNotifications = this.notifications.filter(n => 
        n.type.startsWith('LEAVE') || n.type === 'REVIEW_COMPLETED'
      );
    }
  }

  updateUnreadCount() {
      this.unreadCount = this.filteredNotifications.filter(n => !n.read).length;
  }

  markAsRead(id: number | undefined) {
      if(!id) return;
      const notif = this.notifications.find(n => n.id === id);
      if(notif) {
          notif.read = true;
          this.updateUnreadCount();
      }
      // In a real app, call service: this.notificationService.markAsRead(id).subscribe();
  }

  markAllAsRead() {
      this.filteredNotifications.forEach(n => n.read = true);
      this.updateUnreadCount();
  }

  getIcon(type: string): string {
      switch(type) {
          case 'LEAVE_APPROVED': return 'check_circle';
          case 'LEAVE_REJECTED': return 'cancel';
          case 'REVIEW_COMPLETED': return 'assessment';
          case 'SYSTEM_ALERT': return 'warning';
          default: return 'notifications';
      }
  }

  getIconClass(type: string): string {
      switch(type) {
          case 'LEAVE_APPROVED': return 'success';
          case 'LEAVE_REJECTED': return 'danger';
          case 'REVIEW_COMPLETED': return 'info';
          case 'SYSTEM_ALERT': return 'warning';
          default: return 'default';
      }
  }
}
