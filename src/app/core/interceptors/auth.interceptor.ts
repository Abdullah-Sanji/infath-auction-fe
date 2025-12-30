import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { getAccessToken } from '../utils/cookie.util';
import { NotificationService } from '@core/services/notification.service';

/**
 * HTTP Interceptor that attaches access token to all requests
 * and handles authentication errors
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = getAccessToken();
  const notificationService = inject(NotificationService);

  // Clone request and add authorization header if token exists
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
  }
  // Note: If no token, request proceeds without Authorization header
  // The backend will return 401 if authentication is required

  // Handle the request and catch errors
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An error occurred';

      if (error.status === 401) {
        // Unauthorized - show message but DON'T redirect during API call
        // Let the calling component handle the redirect
        errorMessage = 'Your session has expired. Please log in again.';
        notificationService.error(errorMessage);
        // Note: Removed router.navigate() to prevent redirect during API call
        // The auth.service or component should handle navigation after error
      } else if (error.status === 400) {
        // Bad Request
        errorMessage = error.error?.message || 'Invalid request. Please check your input.';
        notificationService.error(errorMessage);
      } else if (error.status === 500) {
        // Internal Server Error
        errorMessage = 'Server error. Please try again later.';
        notificationService.error(errorMessage);
      }
      else {
        notificationService.error(errorMessage);
      }

      return throwError(() => error);
    })
  );
};
