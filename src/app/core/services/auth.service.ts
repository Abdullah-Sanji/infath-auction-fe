import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, Observable } from 'rxjs';
import { setCookie, getCookie, deleteCookie } from '../utils/cookie.util';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './api.service';
import { OidcSsoProvider } from './oidc/oidc-sso.provider';
import { UserProfile, AuthState, LogoutOptions } from '@shared/models/auth.models';
import { Result, LoginResponse } from '@shared/models/result';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly api = inject(ApiService);
  private readonly router: Router = inject(Router);
  private readonly provider = inject(OidcSsoProvider);
  private readonly redirectUrl = signal<string>('/');


  // Internal state signals
  private readonly _isInitialized = signal(false);
  private readonly _isSSOAuthenticated = signal(false);
  private readonly _isAuthenticated = signal(false);
  private readonly _userProfile = signal<UserProfile | null>(null);
  private readonly _isLoading = signal(false);

  // Public readonly signals
  readonly isInitialized = this._isInitialized.asReadonly();
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly userProfile = this._userProfile.asReadonly();
  /** Access token derived from Cookie */
  readonly accessToken = computed(() => {
    if (!this.isBrowser) return null;
    if (!getCookie('access_token')) return null;
    return getCookie('access_token')?.replace(/^Bearer\s+/, '');
  });
  readonly isLoading = this._isLoading.asReadonly();

  readonly userRoles = computed(() => this._userProfile()?.roles ?? []);

  readonly authState = computed<AuthState>(() => ({
    isInitialized: this._isInitialized(),
    isAuthenticated: this._isSSOAuthenticated(),
    user: this._userProfile(),
  }));

  // Observable versions for RxJS compatibility
  readonly isAuthenticated$: Observable<boolean> = toObservable(this.isAuthenticated);
  readonly userProfile$: Observable<UserProfile | null> = toObservable(this.userProfile);
  readonly authState$: Observable<AuthState> = toObservable(this.authState);

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  /* ----- API helper methods (merged from AuthApiService) ----- */
  registerApi(payload: unknown) {
    const path = `/users/api/v1/auth/register`;
    return this.api.post(path, payload);
  }

  loginApi(payload: { Email: string; Password: string }) {
    const path = `/users/api/v1/auth/login`;
    return this.api.post<LoginResponse>(path, payload);
  }

  getProfileApi(): Observable<Result<UserProfile>> {
    const path = `/users/api/v1/users/profile`;
    return this.api.get<UserProfile>(path);
  }

  exchangeTokenApi(token: string) {
    const path = `/users/api/v1/auth/token`;
    return this.api.post<LoginResponse>(path, { token });
  }

  /**
   * Initialize the authentication service.
   * Call this in APP_INITIALIZER or component ngOnInit.
   */
  async init(): Promise<void> {
    if (!this.isBrowser || this._isInitialized()) {
      return;
    }

    this._isLoading.set(true);

    // Check if we already have an access token (e.g., from credential login)
    if (getCookie('access_token')) {
      this._isAuthenticated.set(true);
      this._isInitialized.set(true);
      this._isLoading.set(false);
      await this.loadUserProfile();
      return;
    }
  }

  /**
   * Subscribe to SSO provider auth change events.
   * Called from init() after provider is safely available.
   */
  private subscribeToProviderAuthChanges(): void {
    if (!this.isBrowser) return;
    try {
      const prov = this.provider;
      if ('onAuthChange' in prov) {
        (prov as any).onAuthChange(async (authenticated: boolean) => {
          this._isSSOAuthenticated.set(authenticated);
          if (authenticated) {
            await this.loadSSOUserProfile();
            await this.exchangeToken();
          } else {
            this.resetAuthState();
          }
        });
      }
    } catch {
      // provider not available; will be handled elsewhere
    }
  }

  /**
   * Trigger the login flow.
   * Redirects to the SSO provider's login page.
   */
  async login(): Promise<void> {
    if (!this.isBrowser) {
      console.warn('AuthService: Cannot login - not in browser');
      return;
    }

    this._isLoading.set(true);
    await this.provider.login();
    this._isLoading.set(false);
  }

  /**
   * Login using username/password (non-SSO) and bootstrap session.
   * On success: save access token then load user profile from API.
   */
  loginWithCredentials(payload: { Email: string; Password: string }): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isBrowser) {
        resolve(false);
        return;
      }

      this._isLoading.set(true);

      this.loginApi(payload).subscribe({
        next: async (resp) => {
          try {
            const ok = !!(resp?.isSuccess ?? true);
            const token = resp.data.accessToken ?? null;

            if (!ok || !token) {
              resolve(false);
              return;
            }
            this.setAccessToken(token);
            await this.loadUserProfile();
            resolve(true);
          } catch (error) {
            console.error('AuthService: Credential login failed:', error);
            resolve(false);
          } finally {
            this._isLoading.set(false);
          }
        },
        error: (error) => {
          console.error('AuthService: Credential login failed:', error);
          this._isLoading.set(false);
          resolve(false);
        },
      });
    });
  }

  /**
   * Trigger the logout flow.
   * Redirects to the SSO provider's logout page.
   */
  async logout(options?: LogoutOptions): Promise<void> {
    if (!this.isBrowser) {
      return;
    }

    const prov = this.provider;
    if (prov) {
      await prov.logout(options);
    }
    this.resetAuthState();
  }

  /**
   * Set access token programmatically (e.g., after credential login)
   */
  setAccessToken(token: string): void {
    if (!this.isBrowser) return;
    setCookie('access_token', token, 3600);
    this._isAuthenticated.set(true);
  }

  resetAuthState(): void {
    if (!this.isBrowser) return;
    deleteCookie('access_token');
    this._isAuthenticated.set(false);
    this._isSSOAuthenticated.set(false);
    this._userProfile.set(null);
  }

  /**
   * Check if the user has a specific role.
   */
  async hasRole(role: string): Promise<boolean> {
    if (!this.isBrowser) {
      return false;
    }
    const prov = this.provider;
    if (!prov) return false;
    return prov.hasRole(role);
  }

  /**
   * Check if the user has any of the specified roles.
   */
  async hasAnyRole(roles: string[]): Promise<boolean> {
    if (!this.isBrowser) {
      return false;
    }
    const prov = this.provider;
    if (!prov) return false;
    return prov.hasAnyRole(roles);
  }

  /**
   * Synchronous check for any of the specified roles using cached user data.
   */
  hasAnyRoleSync(roles: string[]): boolean {
    const userRoles = this._userProfile()?.roles ?? [];
    return roles.some((role) => userRoles.includes(role));
  }

  async tryGetSSOToken(): Promise<string | null> {
    if (!this.isBrowser) return null;
    try {
      const prov = this.provider;
      if (!prov) {
        return null;
      }
      const token = await prov.getToken();
      return token;
    } catch {
      return null;
    }
  }

  /**
   * Exchange SSO token for access token.
   * Called after successful SSO authentication.
   */
  async exchangeToken(): Promise<void> {
    if (!this.isBrowser) return;

    return new Promise(async (resolve, reject) => {
      const ssoToken = await this.tryGetSSOToken();
      if (!ssoToken) {
        console.warn('AuthService: Cannot exchange token - no SSO token available');
        resolve();
        return;
      }

      this.exchangeTokenApi(ssoToken).subscribe({
        next: async (response) => {
          try {
            const ok = response.isSuccess;
            const accessToken = response.data?.accessToken;
            if (ok && accessToken) {
              this.setAccessToken(accessToken);
              await this.loadUserProfile();
            } else {
              console.error(
                'AuthService: Access token exchange failed - invalid response',
                response
              );
            }
          } catch (err) {
            return reject(err);
          }
        },
        error: (error) => {
          this._isAuthenticated.set(false);
          if (error && error.statusCode === 404) {
            return reject('not-registered');
          }
          return reject(error);
        },
      });
    });
  }

  /**
   * Fetch user profile from API and cache locally.
   */
  private async loadUserProfile(): Promise<void> {
    try {
      const resp = await firstValueFrom(this.getProfileApi());
      //todo: map missing properties
      const data: UserProfile = resp.data;
      const profile: UserProfile = {
        id: data?.id,
        username: data?.username,
        email: data?.email,
        firstName: data?.firstName,
        lastName: data?.lastName,
        fullName: data?.fullName,
        roles: data?.roles ?? [],
        attributes: data?.attributes ?? {},
        phoneNumber: data?.phoneNumber,
      };
      this._userProfile.set(profile);
    } catch (error) {
      console.error('AuthService: Failed to load user profile:', error);
    }
  }

  /**
   * Load and cache the user profile.
   */
  async loadSSOUserProfile(): Promise<UserProfile | null> {
    if (!this.isBrowser) {
      return null;
    }

    try {
      const prov = this.provider;
      if (!prov) return null;
      const profile = await prov.getUserProfile();
      this._userProfile.set(profile);
      return profile;
    } catch {
      return null;
    }
  }

  /**
   * Ensure an access token and profile are available.
   * This will try to use an existing access token, or exchange the SSO
   * token for a access token and then load the profile. Safe to call from
   * components that may run before full auth initialization.
   */
  async ensureProfileLoaded(): Promise<UserProfile | null> {
    if (!this.isBrowser) return null;

    // If we already have an access token, just load the profile
    if (getCookie('access_token')) {
      await this.loadUserProfile();
      return this._userProfile();
    }

    // Try to exchange SSO token for access token (if provider available)
    try {
      const prov = this.provider;
      if (!prov) return null;
      await this.exchangeToken();
      // loadUserProfile is called by exchangeToken on success,
      // but call again to be safe if the flow changed
      if (getCookie('access_token')) {
        await this.loadUserProfile();
      }
      return this._userProfile();
    } catch (err) {
      return this._userProfile();
    }
  }

    /**
   * Set the redirect URL after successful login
   */
    setRedirectUrl(url: string): void {
      this.redirectUrl.set(url);
    }
}
