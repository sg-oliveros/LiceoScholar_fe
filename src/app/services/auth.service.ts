import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, tap } from 'rxjs';

interface LoginCredentials {
  Email: string;
  Password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

interface User {
  UserID: number;
  FirstName: string;
  LastName: string;
  Email: string;
  RoleID: number;
  CourseID: number;
  Phone_number: string;
  CourseName: string;
  CourseCode: string;
}

interface GetMeResponse {
  user: User;
}

interface UpdateUserData {
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Phone_number?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/auth';

  login(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { Email: email });
  }
  resetPassword(otp: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { OTP_Code: otp, NewPassword: password });
  }
  
  
  register(credentials: LoginCredentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, credentials).pipe(
      tap(response => {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('currentUser', JSON.stringify(response.user));
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('currentUser');
  }

  isAuthenticated(): boolean {
    return !!sessionStorage.getItem('authToken');
  }

  getToken(): string | null {
    return sessionStorage.getItem('authToken');
  }

  getCurrentUser() {
    const user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  getUserRole(): number | null {
    const user = this.getCurrentUser();
    return user?.RoleID ?? null;
  }

  getMe(): Observable<GetMeResponse> {
    const token = this.getToken();
    console.log('getMe - token from sessionStorage:', token ? 'exists' : 'null');
    return this.http.get<GetMeResponse>(`${this.apiUrl}/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }

getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  updateUser(userId: number, data: UpdateUserData): Observable<any> {
    const token = this.getToken();
    return this.http.put(`http://localhost:3000/users/${userId}`, data, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
  }
}
