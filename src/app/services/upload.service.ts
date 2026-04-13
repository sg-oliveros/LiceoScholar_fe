import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/upload';

  uploadProfilePhoto(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId.toString());

    return this.http.post(`${this.apiUrl}/profile-photo`, formData);
  }

  getProfilePhoto(userId: number): Observable<{ photoUrl: string | null }> {
    return this.http.get<{ photoUrl: string | null }>(`${this.apiUrl}/profile-photo/${userId}`);
  }

  getPhotoUrl(photoPath: string | null): string {
    if (!photoPath) {
      return 'assets/images/default-avatar.png'; // Default avatar
    }
    return `http://localhost:3000${photoPath}`;
  }

  deleteProfilePhoto(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/profile-photo/${userId}`);
  }
}
