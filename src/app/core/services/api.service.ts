import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Result } from '@shared/models/result';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  get<T>(path: string): Observable<Result<T>> {
    return this.http.get<Result<T>>(`${this.apiUrl}${path}`).pipe(
      map((res) => res)
    );
  }

  post<T>(path: string, body: any = {}): Observable<Result<T>> {
    return this.http.post<Result<T>>(`${this.apiUrl}${path}`, body).pipe(
      map((res) => res)
    );
  }

  put<T>(path: string, body: any = {}): Observable<Result<T>> {
    return this.http.put<Result<T>>(`${this.apiUrl}${path}`, body).pipe(
      map((res) => res)
    );
  }

  delete(path: string): Observable<Result> {
    return this.http.delete<Result>(`${this.apiUrl}${path}`).pipe(
      map((res) => res)
    );
  }
}
