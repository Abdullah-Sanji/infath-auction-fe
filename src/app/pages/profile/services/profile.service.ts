import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, ProfileUpdateRequest, ProfileUpdateResponse } from '../interfaces/profile.interface';

@Injectable()
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = '/api/profile';

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}`);
  }

  updateProfile(data: ProfileUpdateRequest): Observable<ProfileUpdateResponse> {
    return this.http.put<ProfileUpdateResponse>(`${this.apiUrl}`, data);
  }

  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);
    return this.http.post<{ avatarUrl: string }>(`${this.apiUrl}/avatar`, formData);
  }

  deleteAvatar(): Observable<{ success: boolean }> {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/avatar`);
  }
}

