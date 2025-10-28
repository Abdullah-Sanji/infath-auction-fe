import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom, catchError, of, tap } from 'rxjs';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie.util';
import { environment } from '../../../environments/environment';
import {
  User,
  LoginRequest,
  TokenResponse,
  RefreshTokenRequest,
  KeycloakUserInfo,
} from './auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private router = inject(Router);
  private http = inject(HttpClient);

  private currentUser = signal<User | null>(null);
  private redirectUrl = signal<string>('/');

  private readonly COOKIE_NAME = 'currentUser';
  private readonly ACCESS_TOKEN_COOKIE = 'access_token';
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token';
  private readonly COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds
  private readonly TOKEN_REFRESH_THRESHOLD = 60; // Refresh token 60 seconds before expiry

  // Computed signals for reactive state
  public readonly user = computed(() => this.currentUser());
  public readonly isLoggedIn = computed(() => this.currentUser() !== null);

  constructor() {
    // Check if user is already logged in (from cookies)
    this.checkStoredAuth();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  /**
   * Login with username/email and password via Keycloak
   */
  async login(username: string, password: string): Promise<boolean> {
    try {
      const loginRequest: LoginRequest = {
        username,
        password,
      };

      // Call backend login endpoint (which communicates with Keycloak)
      const tokenResponse = await firstValueFrom(
        this.http.post<TokenResponse>(`${environment.apiUrl}/auth/login`, loginRequest)
      );

      // Store tokens
      this.storeTokens(tokenResponse);

      // Fetch user information
      await this.fetchUserInfo();

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Logout the current user from Keycloak
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = getCookie(this.REFRESH_TOKEN_COOKIE);

      if (refreshToken) {
        // Call backend logout endpoint
        await firstValueFrom(
          this.http.post(`${environment.apiUrl}/auth/logout`, { refresh_token: refreshToken }).pipe(
            catchError((error) => {
              console.error('Logout error:', error);
              return of(null);
            })
          )
        );
      }
    } finally {
      // Clear local state regardless of API call success
      this.clearAuthState();
      this.router.navigate(['/login']);
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = getCookie(this.REFRESH_TOKEN_COOKIE);

      if (!refreshToken) {
        return false;
      }

      const refreshRequest: RefreshTokenRequest = {
        refresh_token: refreshToken,
      };

      const tokenResponse = await firstValueFrom(
        this.http.post<TokenResponse>(`${environment.apiUrl}/auth/refresh`, refreshRequest)
      );

      this.storeTokens(tokenResponse);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearAuthState();
      return false;
    }
  }

  /**
   * Fetch user information from Keycloak
   */
  private async fetchUserInfo(): Promise<void> {
    try {
      const userInfo = await firstValueFrom(
        this.http.get<KeycloakUserInfo>(`${environment.apiUrl}/auth/userinfo`)
      );

      const user: User = {
        id: userInfo.sub,
        email: userInfo.email,
        name: userInfo.name,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        username: userInfo.preferred_username,
        emailVerified: userInfo.email_verified,
      };

      this.currentUser.set(user);

      // Store user in cookie for persistence
      setCookie(this.COOKIE_NAME, JSON.stringify(user), this.COOKIE_MAX_AGE);
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw error;
    }
  }

  /**
   * Store tokens in cookies
   */
  private storeTokens(tokenResponse: TokenResponse): void {
    // Store access token
    setCookie(this.ACCESS_TOKEN_COOKIE, tokenResponse.access_token, tokenResponse.expires_in);

    // Store refresh token
    setCookie(
      this.REFRESH_TOKEN_COOKIE,
      tokenResponse.refresh_token,
      tokenResponse.refresh_expires_in
    );
  }

  /**
   * Clear all authentication state
   */
  private clearAuthState(): void {
    this.currentUser.set(null);
    deleteCookie(this.COOKIE_NAME);
    deleteCookie(this.ACCESS_TOKEN_COOKIE);
    deleteCookie(this.REFRESH_TOKEN_COOKIE);
  }

  /**
   * Set the redirect URL after successful login
   */
  setRedirectUrl(url: string): void {
    this.redirectUrl.set(url);
  }

  /**
   * Get and clear the redirect URL
   */
  getRedirectUrl(): string {
    const url = this.redirectUrl();
    this.redirectUrl.set('/');
    return url;
  }

  /**
   * Check if there's a stored authentication
   */
  private checkStoredAuth(): void {
    const storedUser = getCookie(this.COOKIE_NAME);
    const accessToken = getCookie(this.ACCESS_TOKEN_COOKIE);

    if (storedUser && accessToken) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUser.set(user);
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        this.clearAuthState();
      }
    }
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUser();
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return getCookie(this.ACCESS_TOKEN_COOKIE);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return getCookie(this.REFRESH_TOKEN_COOKIE);
  }
}
