import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { authInterceptor } from './auth.interceptor';
import { of, throwError } from 'rxjs';
import * as cookieUtil from '../utils/cookie.util';

describe('authInterceptor', () => {
  let router: jasmine.SpyObj<Router>;
  let messageService: jasmine.SpyObj<MessageService>;
  let getAccessTokenSpy: jasmine.Spy;

  const executeInterceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    });

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    messageService = TestBed.inject(MessageService) as jasmine.SpyObj<MessageService>;
    getAccessTokenSpy = spyOn(cookieUtil, 'getAccessToken');
  });

  it('should attach authorization header when token exists', (done) => {
    const mockToken = 'test-token-123';
    getAccessTokenSpy.and.returnValue(mockToken);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockNext = jasmine.createSpy('next').and.returnValue(of({}));

    executeInterceptor(mockRequest, mockNext).subscribe(() => {
      const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
      expect(modifiedRequest.headers.get('Authorization')).toBe(`Bearer ${mockToken}`);
      done();
    });
  });

  it('should proceed without token when token is missing', (done) => {
    getAccessTokenSpy.and.returnValue(null);

    const mockRequest = new HttpRequest('GET', '/api/test');
    const mockNext = jasmine.createSpy('next').and.returnValue(of({}));

    executeInterceptor(mockRequest, mockNext).subscribe(() => {
      const modifiedRequest = mockNext.calls.mostRecent().args[0] as HttpRequest<unknown>;
      expect(modifiedRequest.headers.has('Authorization')).toBe(false);
      expect(router.navigate).not.toHaveBeenCalled();
      expect(messageService.add).not.toHaveBeenCalled();
      done();
    });
  });

  it('should handle 401 error and redirect to login', (done) => {
    getAccessTokenSpy.and.returnValue('test-token');

    const mockRequest = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Unauthorized',
      status: 401,
      statusText: 'Unauthorized'
    });
    const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

    executeInterceptor(mockRequest, mockNext).subscribe({
      error: (error) => {
        expect(error.status).toBe(401);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Authentication Failed',
          detail: 'Your session has expired. Please log in again.'
        });
        done();
      }
    });
  });

  it('should handle 400 error with toast message', (done) => {
    getAccessTokenSpy.and.returnValue('test-token');

    const mockRequest = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: { message: 'Invalid input' },
      status: 400,
      statusText: 'Bad Request'
    });
    const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

    executeInterceptor(mockRequest, mockNext).subscribe({
      error: (error) => {
        expect(error.status).toBe(400);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Bad Request',
          detail: 'Invalid input'
        });
        done();
      }
    });
  });

  it('should handle 500 error with toast message', (done) => {
    getAccessTokenSpy.and.returnValue('test-token');

    const mockRequest = new HttpRequest('GET', '/api/test');
    const errorResponse = new HttpErrorResponse({
      error: 'Server Error',
      status: 500,
      statusText: 'Internal Server Error'
    });
    const mockNext = jasmine.createSpy('next').and.returnValue(throwError(() => errorResponse));

    executeInterceptor(mockRequest, mockNext).subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
        expect(messageService.add).toHaveBeenCalledWith({
          severity: 'error',
          summary: 'Server Error',
          detail: 'Server error. Please try again later.'
        });
        done();
      }
    });
  });
});

