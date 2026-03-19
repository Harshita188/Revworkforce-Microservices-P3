import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Designation {
  id?: number;
  title: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DesignationService {
  private baseUrl = `${environment.apiUrl}/designations`;

  constructor(private http: HttpClient) {}

  getAllDesignations(): Observable<Designation[]> {
    return this.http.get<Designation[]>(this.baseUrl);
  }

  createDesignation(designation: Designation): Observable<Designation> {
    return this.http.post<Designation>(this.baseUrl, designation);
  }
  
  updateDesignation(id: number, designation: Designation): Observable<Designation> {
     return this.http.put<Designation>(`${this.baseUrl}/${id}`, designation);
  }
  
  deleteDesignation(id: number): Observable<void> {
     return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
