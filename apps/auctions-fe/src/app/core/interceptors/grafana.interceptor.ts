/* import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { tap, catchError, finalize } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GrafanaService } from '../services/grafana.service'; */

/**
 * HTTP Interceptor for Grafana Frontend Observability
 *
 * Automatically tracks:
 * - All HTTP requests (method, URL, status)
 * - Request duration and performance
 * - HTTP errors with context
 * - API response times
 *
 * This provides centralized observability for all API calls without
 * needing to add tracking code to each service.
 */
/* export const grafanaInterceptor: HttpInterceptorFn = (req, next) => {
  const grafanaService = inject(GrafanaService);

  // Record start time for performance tracking
  const startTime = performance.now();
  const method = req.method;
  const url = req.url;

  // Extract just the path (remove query params for cleaner tracking)
  const urlPath = url.split('?')[0];
  const urlParts = new URL(url, window.location.origin);
  const endpoint = urlParts.pathname;

  return next(req).pipe(
    tap((event) => {
      // Track successful responses
      if (event instanceof HttpResponse) {
        const duration = performance.now() - startTime;

        // Track API call event
        grafanaService.trackEvent({
          name: 'api_call',
          attributes: {
            method,
            endpoint,
            status: event.status.toString(),
            statusText: event.statusText,
            success: 'true',
          },
          domain: 'http',
        });

        // Track API performance
        grafanaService.trackPerformance({
          name: 'api_call_duration',
          value: duration,
          attributes: {
            method,
            endpoint,
            status: event.status.toString(),
          },
        });
      }
    }),
    catchError((error: HttpErrorResponse) => {
      const duration = performance.now() - startTime;

      // Track API error event
      grafanaService.trackEvent({
        name: 'api_call_error',
        attributes: {
          method,
          endpoint,
          status: error.status.toString(),
          statusText: error.statusText || 'Unknown Error',
          errorMessage: error.message,
          success: 'false',
        },
        domain: 'http',
      });

      // Track error performance (even failed requests matter)
      grafanaService.trackPerformance({
        name: 'api_call_duration',
        value: duration,
        attributes: {
          method,
          endpoint,
          status: error.status.toString(),
          error: 'true',
        },
      });

      // Track specific error with more context
      grafanaService.trackError(error, {
        context: 'http_request',
        attributes: {
          method,
          endpoint,
          status: error.status,
          url: error.url || url,
        },
      });

      // Re-throw the error so it can be handled by other interceptors/services
      return throwError(() => error);
    })
  );
}; */
