import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserProfile {
  SchoolID: number;
  FullName: string;
  Course: string;
  Scholarship: string;
  Email: string;
  Phone_Number: string;
}

export interface StudentListItem {
  SchoolID: number;
  UserID: number;
  FullName: string;
  Email: string;
  Course: string;
  IsActiveScholar: 'Yes' | 'No';
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getUserProfile(userId: number): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile/${userId}`);
  }

  getStudentsList(): Observable<StudentListItem[]> {
    return this.http.get<StudentListItem[]>(`${this.apiUrl}/users/students`);
  }
  
  deleteStudent(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`);
  }

  updateUser(userId: number, data: any): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/users/${userId}`, data);
  }
}
