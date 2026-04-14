import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

interface Requirement {
  RequirementID: number;
  UserID: number;
  RequirementName: string;
  RequirementDescription: string;
  RequirementType: string;
  RequirementStatus: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequirementsService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000';

  getUserRequirements(userId: number): Observable<Requirement[]> {
    return this.http.get<Requirement[]>(`${this.apiUrl}/requirements/user/${userId}`, {
      headers: this.authService.getAuthHeaders()
    });
  }

  updateRequirementStatus(userId: number, requirementId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/requirements/user/${userId}/${requirementId}/${status}`, {}, {
      headers: this.authService.getAuthHeaders()
    });
  }
}
