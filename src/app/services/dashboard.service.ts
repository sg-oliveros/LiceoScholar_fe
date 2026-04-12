import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface DashboardStats {
  activeUsers: number;
  totalUsers: number;
  dailyApplications: number[];
  collegeData: {
    labels: string[];
    data: number[];
    backgroundColor: string[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats/dashboard`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUserStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/users`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getApplicationStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/applications`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUsersByCollege(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/usersByCollege`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
