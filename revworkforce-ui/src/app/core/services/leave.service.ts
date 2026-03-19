import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface LeaveRequest {
  id?: number;
  employeeId: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  //status?: string;
}

export interface LeaveBalance {
  id?: number;
  employeeId: number;
  leaveType: string;
  totalDays: number;
  usedDays: number;
  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class LeaveService {
  private baseUrl = `${environment.apiUrl}/api/leaves`;

  constructor(private http: HttpClient) { }

  apply(request: any): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/apply`, request);
  }

  approve(request: any): Observable<LeaveRequest> {
    return this.http.post<LeaveRequest>(`${this.baseUrl}/approve`, request);
  }

  getHistory(employeeId: number): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/history/${employeeId}`);
  }

  getBalances(employeeId: number): Observable<LeaveBalance[]> {
    return this.http.get<LeaveBalance[]>(`${this.baseUrl}/balances/${employeeId}`);
  }
  applyForLeave(data: any) {
    return this.http.post(`${this.baseUrl}/apply`, data);
  }

  getMyLeaves(employeeId: number) {
    return this.http.get(`${this.baseUrl}/history/${employeeId}`);
  }
  // getPendingLeaves() {
  //   return this.http.get<any[]>(`${this.baseUrl}/pending`);
  // }
  getPendingLeaves(): Observable<LeaveRequest[]> {
    return this.http.get<LeaveRequest[]>(`${this.baseUrl}/pending`);
  }

  processLeaveRequest(requestId: number, status: string, managerId: number, managerComment: string) {
    return this.http.post(`${this.baseUrl}/approve`, {
      requestId: requestId,
      managerId: managerId,
      status: status,
      managerComment: managerComment
    });
  }
}
