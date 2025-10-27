import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { TokenResponse, KeycloakUserInfo } from './auth.interface';
import { environment } from '../../../environments/environment';
import * as CookieUtil from '../utils/cookie.util';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear cookies before each test
    spyOn(CookieUtil, 'setCookie');
    spyOn(CookieUtil, 'getCookie').and.returnValue(null);
    spyOn(CookieUtil, 'deleteCookie');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with no authenticated user', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.user()).toBeNull();
    expect(service.isLoggedIn()).toBe(false);
  });

  describe('login', () => {
    it('should successfully login with valid credentials', async () => {
      const mockTokenResponse: TokenResponse = {
        access_token: 'mock_access_token',
        expires_in: 3600,
        refresh_expires_in: 7200,
        refresh_token: 'mock_refresh_token',
        token_type: 'Bearer'
      };

      const mockUserInfo: KeycloakUserInfo = {
        sub: 'user-123',
        email_verified: true,
        name: 'Test User',
        preferred_username: 'testuser',
        given_name: 'Test',
        family_name: 'User',
        email: 'test@example.com'
      };

      const loginPromise = service.login('testuser', 'password123');

      // Expect login request
      const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(loginReq.request.method).toBe('POST');
      expect(loginReq.request.body).toEqual({
        username: 'testuser',
        password: 'password123'
      });
      loginReq.flush(mockTokenResponse);

      // Expect userinfo request
      const userInfoReq = httpMock.expectOne(`${environment.apiUrl}/auth/userinfo`);
      expect(userInfoReq.request.method).toBe('GET');
      userInfoReq.flush(mockUserInfo);

      const result = await loginPromise;

      expect(result).toBe(true);
      expect(CookieUtil.setCookie).toHaveBeenCalledWith(
        'access_token',
        mockTokenResponse.access_token,
        mockTokenResponse.expires_in
      );
      expect(CookieUtil.setCookie).toHaveBeenCalledWith(
        'refresh_token',
        mockTokenResponse.refresh_token,
        mockTokenResponse.refresh_expires_in
      );
    });

    it('should return false on login failure', async () => {
      const loginPromise = service.login('wronguser', 'wrongpass');

      const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      loginReq.flush(
        { message: 'Invalid credentials' },
        { status: 401, statusText: 'Unauthorized' }
      );

      const result = await loginPromise;

      expect(result).toBe(false);
    });

    it('should handle network errors during login', async () => {
      const loginPromise = service.login('testuser', 'password123');

      const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      loginReq.error(new ProgressEvent('error'));

      const result = await loginPromise;

      expect(result).toBe(false);
    });
  });

  describe('logout', () => {
    it('should call logout endpoint and clear auth state', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue('mock_refresh_token');
      router.navigate.and.returnValue(Promise.resolve(true));

      const logoutPromise = service.logout();

      const logoutReq = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      expect(logoutReq.request.method).toBe('POST');
      expect(logoutReq.request.body).toEqual({
        refresh_token: 'mock_refresh_token'
      });
      logoutReq.flush({});

      await logoutPromise;

      expect(CookieUtil.deleteCookie).toHaveBeenCalledWith('currentUser');
      expect(CookieUtil.deleteCookie).toHaveBeenCalledWith('access_token');
      expect(CookieUtil.deleteCookie).toHaveBeenCalledWith('refresh_token');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should clear auth state even if logout endpoint fails', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue('mock_refresh_token');
      router.navigate.and.returnValue(Promise.resolve(true));

      const logoutPromise = service.logout();

      const logoutReq = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
      logoutReq.error(new ProgressEvent('error'));

      await logoutPromise;

      expect(CookieUtil.deleteCookie).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should logout without refresh token', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue(null);
      router.navigate.and.returnValue(Promise.resolve(true));

      await service.logout();

      expect(CookieUtil.deleteCookie).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh access token', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue('mock_refresh_token');

      const mockTokenResponse: TokenResponse = {
        access_token: 'new_access_token',
        expires_in: 3600,
        refresh_expires_in: 7200,
        refresh_token: 'new_refresh_token',
        token_type: 'Bearer'
      };

      const refreshPromise = service.refreshToken();

      const refreshReq = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      expect(refreshReq.request.method).toBe('POST');
      expect(refreshReq.request.body).toEqual({
        refresh_token: 'mock_refresh_token'
      });
      refreshReq.flush(mockTokenResponse);

      const result = await refreshPromise;

      expect(result).toBe(true);
      expect(CookieUtil.setCookie).toHaveBeenCalledWith(
        'access_token',
        mockTokenResponse.access_token,
        mockTokenResponse.expires_in
      );
    });

    it('should return false if no refresh token exists', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue(null);

      const result = await service.refreshToken();

      expect(result).toBe(false);
    });

    it('should handle refresh token failure and clear auth', async () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue('invalid_token');

      const refreshPromise = service.refreshToken();

      const refreshReq = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
      refreshReq.flush(
        { message: 'Invalid token' },
        { status: 401, statusText: 'Unauthorized' }
      );

      const result = await refreshPromise;

      expect(result).toBe(false);
      expect(CookieUtil.deleteCookie).toHaveBeenCalled();
    });
  });

  describe('redirect URL', () => {
    it('should set and get redirect URL', () => {
      service.setRedirectUrl('/auctions');
      const url = service.getRedirectUrl();

      expect(url).toBe('/auctions');
    });

    it('should clear redirect URL after getting it', () => {
      service.setRedirectUrl('/auctions');
      service.getRedirectUrl();
      const url = service.getRedirectUrl();

      expect(url).toBe('/');
    });
  });

  describe('getAccessToken', () => {
    it('should return access token from cookie', () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue('mock_access_token');

      const token = service.getAccessToken();

      expect(token).toBe('mock_access_token');
      expect(CookieUtil.getCookie).toHaveBeenCalledWith('access_token');
    });

    it('should return null if no access token exists', () => {
      (CookieUtil.getCookie as jasmine.Spy).and.returnValue(null);

      const token = service.getAccessToken();

      expect(token).toBeNull();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', () => {
      const user = service.getCurrentUser();

      expect(user).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('should return false when not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });
});
