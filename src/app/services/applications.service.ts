import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface CreateApplicationRequest {
  UserID: number;
  ScholarshipID: number;
}

interface CreateApplicationResponse {
  message: string;
  applicationId?: number;
}

interface Application {
  ApplicationID: number;
  UserID: number;
  FullName: string;
  Course: string;
  ScholarshipType: string;
  Application_Date: string;
  Status: string;
}

interface Scholarship {
  ScholarshipID: number;
  Scholarship_Name: string;
  Scholarship_Type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  // Create a new scholarship application
  createApplication(userId: number, scholarshipId: number): Observable<CreateApplicationResponse> {
    const payload: CreateApplicationRequest = {
      UserID: userId,
      ScholarshipID: scholarshipId
    };
    return this.http.post<CreateApplicationResponse>(`${this.apiUrl}/applications/create`, payload);
  }

  
  getAllApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications`);
  }
  
  getUserApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/user/${userId}`);
  }

  // Get all available scholarships
  getScholarships(): Observable<Scholarship[]> {
    // Note: This endpoint may need to be added to the backend
    return this.http.get<Scholarship[]>(`${this.apiUrl}/scholarships`);
  }
}
