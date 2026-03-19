import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatToolbarModule, MatIconModule],
  template: `
    <div class="landing-container">
      <mat-toolbar color="primary" class="header">
        <mat-icon class="logo">groups</mat-icon>
        <span class="title">RevWorkforce</span>
        <span class="spacer"></span>
        <button mat-raised-button color="accent" (click)="goToLogin()">Login</button>
      </mat-toolbar>

      <main class="hero">
        <div class="hero-content">
          <h1>Modern HR Management for the Forward-Thinking Enterprise.</h1>
          <p>Streamline your workforce, manage leaves, track performance, and empower your employees with our comprehensive SaaS platform.</p>
          <div class="cta-buttons">
            <button mat-raised-button color="primary" class="large-btn" (click)="goToLogin()">Get Started</button>
            <button mat-stroked-button color="primary" class="large-btn demo-btn">Book Demo</button>
          </div>
        </div>
        <div class="hero-image">
          <!-- Placeholder for dashboard graphic -->
          <div class="dashboard-mock">
            <div class="mock-header"></div>
            <div class="mock-sidebar"></div>
            <div class="mock-content">
              <div class="mock-card"></div>
              <div class="mock-card"></div>
              <div class="mock-chart"></div>
            </div>
          </div>
        </div>
      </main>
      
      <section class="features">
         <h2>Everything you need to manage your team</h2>
         <div class="feature-grid">
           <div class="feature-card">
              <mat-icon>badge</mat-icon>
              <h3>Employee Directory</h3>
              <p>Centralized employee profiles and organizational charts.</p>
           </div>
           <div class="feature-card">
              <mat-icon>event_busy</mat-icon>
              <h3>Leave Management</h3>
              <p>Simplified time-off requests and automated approval workflows.</p>
           </div>
           <div class="feature-card">
              <mat-icon>assessment</mat-icon>
              <h3>Performance Reviews</h3>
              <p>Structured feedback cycles and goal tracking for growth.</p>
           </div>
         </div>
      </section>
    </div>
  `,
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
