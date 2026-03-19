import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Goal {
  id?: number;
  employeeId: number;
  title: string;
  description: string;
  status: string;
  progress: number;
  targetDate: string;
}

export interface PerformanceReview {
  id?: number;
  employeeId: number;
  reviewerId?: number;
  selfReview?: string;
  reviewerFeedback?: string;
  rating?: number;
  status: string;
  comments?: string;
  managerFeedback?: string;
  reviewCycle?: string;
  employeeName?: string;
  goalTitle?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformanceService {
  private baseUrl = `${environment.apiUrl}/api/performance`;

  constructor(private http: HttpClient) { }

  submitSelfReview(employeeId: number, reviewText: string): Observable<PerformanceReview> {
    return this.http.post<PerformanceReview>(`${this.baseUrl}/self-review?employeeId=${employeeId}`, reviewText);
  }

  provideManagerFeedback(reviewId: number, managerId: number, feedback: string, rating: number): Observable<PerformanceReview> {
    return this.http.post<PerformanceReview>(
      `${this.baseUrl}/manager-feedback/${reviewId}?managerId=${managerId}&feedback=${encodeURIComponent(feedback)}&rating=${rating}`,
      {}
    );
  }

  getHistory(employeeId: number): Observable<PerformanceReview[]> {
    return this.http.get<PerformanceReview[]>(`${this.baseUrl}/history/${employeeId}`);
  }

  addGoal(goal: Goal): Observable<Goal> {
    return this.http.post<Goal>(`${this.baseUrl}/goals`, goal);
  }

  getGoals(employeeId: number): Observable<Goal[]> {
    return this.http.get<Goal[]>(`${this.baseUrl}/goals/${employeeId}`);
  }
}
