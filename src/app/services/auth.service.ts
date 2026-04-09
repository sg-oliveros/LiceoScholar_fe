import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor() { }

  isAuthenticated(): boolean {
    // Check if user is authenticated
    // This could check localStorage, sessionStorage, or a token
    const token = localStorage.getItem('authToken');
    return !!token;
  }

  login(credentials: any): boolean {
    // Implement login logic
    // For now, just set a dummy token
    localStorage.setItem('authToken', 'dummy-token');
    return true;
  }

  logout(): void {
    // Clear authentication data
    localStorage.removeItem('authToken');
  }

  getCurrentUser(): any {
    // Return current user data
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: any): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
}
