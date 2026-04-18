import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


interface CreateApplicationRequest {
  UserID: number;
  ScholarshipID: number;
  SchoolYear: string;
  Semester: number;
}

interface CreateApplicationResponse {
  message: string;
  applicationId?: number;
}

interface Application {
  SchoolID: number;
  ApplicationID: number;
  UserID: number;
  FullName: string;
  Course: string;
  ScholarshipType: string;
  Application_Date: string;
  SchoolYear: string;
  Status: string;
}

interface Scholarship {
  ScholarshipID: number;
  Scholarship_Name: string;
  Scholarship_Type: string;
}

export interface SySem {
  sy_semID: number;
  Year_start: number;
  Year_end: number;
  Semester: number;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000';

  // Create a new scholarship application
  createApplication(userId: number, scholarshipId: number, schoolYear: string, semester: number): Observable<CreateApplicationResponse> {
    const payload: CreateApplicationRequest = {
      UserID: userId,
      ScholarshipID: scholarshipId,
      SchoolYear: schoolYear,
      Semester: semester
    };
    return this.http.post<CreateApplicationResponse>(`${this.apiUrl}/applications/create`, payload);
  }

  
  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  
  getUserApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/user/${userId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  acceptApplication(applicationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/approve/${applicationId}`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  rejectApplication(applicationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/reject/${applicationId}`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  changeToPending(applicationId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/change-to-pending/${applicationId}`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  finishTerm(): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/semester-finish`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }

  // Get all available scholarships
  getScholarships(): Observable<Scholarship[]> {
    // Note: This endpoint may need to be added to the backend
    return this.http.get<Scholarship[]>(`${this.apiUrl}/scholarships`);
  }
  
  getSySem(): Observable<SySem[]> {
    return this.http.get<SySem[]>(`${this.apiUrl}/applications/sy-sem`, {
      headers: this.authService.getAuthHeaders()
    });
  }
  updateSySem(): Observable<any> {
    return this.http.put(`${this.apiUrl}/applications/sy-sem`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
