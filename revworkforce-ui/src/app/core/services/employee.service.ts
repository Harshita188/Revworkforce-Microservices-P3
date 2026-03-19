import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Employee {
  id?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  address?: string;
  department?: any;
  designation?: any;
  departmentId?: number;
  designationId?: number;
  status: string;
  joiningDate: string;
  managerId?: number; // Fetched from User Service
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = `${environment.apiUrl}/employees`;

  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, employee);
  }

  updateEmployee(id: number, employee: Employee): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/${id}`, employee);
  }

  deleteEmployee(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  getEmployeeWithUser(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/with-user/${id}`);
  }

  getEmployeeCount(): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/count`);
  }
}
