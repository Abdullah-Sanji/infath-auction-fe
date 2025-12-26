import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Result } from '@shared/models/result';
import { NotificationService } from '@core/services/notification.service';
import { TranslocoService } from '@jsverse/transloco';
import { deleteCookie, getCookie } from '../utils/cookie.util';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private router: Router,
    private http: HttpClient,
    private translateService: TranslocoService,
    private alertService: NotificationService,
  ) {}

  // Request options
  getHeaders(): HttpHeaders {
    const token = getCookie('access_token');
    const headersConfig: { [key: string]: string } = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': this.translateService.getActiveLang() || 'en',
    };

    // Only add Authorization header if token exists
    if (token) {
      headersConfig['Authorization'] = token;
    }

    return new HttpHeaders(headersConfig);
  }

  getHeadersForUpload(): HttpHeaders {
    const token = getCookie('access_token');
    const headersConfig: { [key: string]: string } = {
      Accept: 'application/json',
      'Accept-Language': this.translateService.getActiveLang(),
    };

    // Only add Authorization header if token exists
    if (token) {
      headersConfig['Authorization'] = token;
    }

    return new HttpHeaders(headersConfig);
  }

  formatErrors(error: any) {
    const status = error?.status ?? null;
    if (status === 401) {
      deleteCookie('access_token');
      this.router.navigateByUrl('/errors/401');
    } else if (status === 403) {
      this.router.navigateByUrl('/errors/403');
    } else if (status === 500) {
      this.alertService.generalError();
    }
    const payload = error?.error;
    return throwError(() => payload);
  }

  get<T>(path: string, params?: HttpParams): Observable<Result<T>> {
    const options: { headers: HttpHeaders; params?: HttpParams } = { headers: this.getHeaders() };
    if (params) options.params = params;
    return this.http.get<Result<T>>(`${this.apiUrl}${path}`, options).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res) => res)
    );
  }

  post<T>(path: string, body: any = {}): Observable<Result<T>> {
    const options = { headers: this.getHeaders() };
    return this.http.post<Result<T>>(`${this.apiUrl}${path}`, body, options).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res) => res)
    );
  }

  put<T>(path: string, body: any = {}): Observable<Result<T>> {
    const options = { headers: this.getHeaders() };
    return this.http.put<Result<T>>(`${this.apiUrl}${path}`, body, options).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res) => res)
    );
  }

  delete(path: string): Observable<Result> {
    const options = { headers: this.getHeaders() };
    return this.http.delete<Result>(`${this.apiUrl}${path}`, options).pipe(
      catchError((er) => this.formatErrors(er)),
      map((res) => res)
    );
  }
}
