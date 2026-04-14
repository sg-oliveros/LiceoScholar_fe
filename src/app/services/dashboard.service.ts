import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface ScholarStats {
  Active_Scholarships: number;
  Total_Users: number;
}

export interface DailyApplicationStat {
  Date: string;
  Total_Applications: number;
}

export interface UsersByCollegeStat {
  CollegeID: number;
  CollegeName: string;
  Total_Users: number;
  college_name?: string;
  user_count?: number;
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

  getScholarStats(): Observable<ScholarStats> {
    return this.http.get<ScholarStats>(`${this.apiUrl}/stats/scholars`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getDailyApplicationsStats(): Observable<DailyApplicationStat[]> {
    return this.http.get<DailyApplicationStat[]>(`${this.apiUrl}/stats/dailyApplications`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  getUsersByCollegeStats(): Observable<UsersByCollegeStat[]> {
    return this.http.get<UsersByCollegeStat[]>(`${this.apiUrl}/stats/usersByCollege`, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
