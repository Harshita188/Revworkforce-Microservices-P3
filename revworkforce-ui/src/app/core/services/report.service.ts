import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HRDashboardData {
  totalEmployees: number;
  pendingLeaves: number;
  averagePerformanceRating: number;
  recentLeaves: any[];
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private baseUrl = `${environment.apiUrl}/api/reports`;

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<HRDashboardData> {
    return this.http.get<HRDashboardData>(`${this.baseUrl}/dashboard`);
  }
}
