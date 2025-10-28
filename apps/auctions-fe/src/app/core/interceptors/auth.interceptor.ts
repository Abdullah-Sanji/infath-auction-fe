import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { getAccessToken } from '../utils/cookie.util';

/**
 * HTTP Interceptor that attaches access token to all requests
 * and handles authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const messageService = inject(MessageService);
  const token = getAccessToken();

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  // Note: If no token, request proceeds without Authorization header
  // The backend will return 401 if authentication is required

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.status === 401) {
        // Unauthorized - redirect to login
        errorMessage = 'Your session has expired. Please log in again.';
        messageService.add({
          severity: 'error',
          summary: 'Authentication Failed',
          detail: errorMessage,
        });
        router.navigate(['/login']);
      } else if (error.status === 400) {
        // Bad Request
        errorMessage = error.error?.message || 'Invalid request. Please check your input.';
        messageService.add({
          severity: 'error',
          summary: 'Bad Request',
          detail: errorMessage,
        });
      } else if (error.status === 500) {
        // Internal Server Error
        errorMessage = 'Server error. Please try again later.';
        messageService.add({
          severity: 'error',
          summary: 'Server Error',
          detail: errorMessage,
        });
      }

      return throwError(() => error);
    })
  );
};
