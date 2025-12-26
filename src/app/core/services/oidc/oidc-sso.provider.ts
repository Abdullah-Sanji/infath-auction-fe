import { isPlatformBrowser } from '@angular/common';
import { DestroyRef, Injectable, NgZone, PLATFORM_ID, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { LoginResponse, OidcSecurityService } from 'angular-auth-oidc-client';
import { BehaviorSubject } from 'rxjs';
import { oidcConfig } from './oidc.config';
import { LogoutOptions, SsoProvider, UserProfile } from '@shared/models/auth.models';

/**
 * OIDC SSO provider implementation using angular-auth-oidc-client.
 * Implements SsoProvider interface for seamless integration with AuthService.
 *
 * This provider works with any OIDC-compliant identity provider including Keycloak.
 */
@Injectable({ providedIn: 'root' })
export class OidcSsoProvider implements SsoProvider {
  readonly name = 'OIDC';

  private readonly platformId = inject(PLATFORM_ID);
  private readonly oidcService = inject(OidcSecurityService, { optional: true });
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);

  private readonly _isAuthenticated$ = new BehaviorSubject<boolean>(false);
  private onAuthChangeCallback?: (authenticated: boolean) => void;

  constructor() {
    if (this.isBrowser && this.oidcService) {
      // Subscribe to authentication state changes
      this.oidcService.isAuthenticated$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(({ isAuthenticated }) => {
          this._isAuthenticated$.next(isAuthenticated);
          this.onAuthChangeCallback?.(isAuthenticated);
        });
    }
  }

  /**
   * Register a callback to be called when authentication state changes.
   */
  onAuthChange(callback: (authenticated: boolean) => void): void {
    this.onAuthChangeCallback = callback;
  }

  private get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  async init(): Promise<boolean> {
    if (!this.isBrowser || !this.oidcService) {
      return false;
    }

    return new Promise((resolve) => {
      // checkAuth() will process the callback URL if present (with code, state, etc.)
      this.oidcService!.checkAuth().subscribe({
        next: (result: LoginResponse) => {
          this._isAuthenticated$.next(result.isAuthenticated);

          // Clean up URL after successful callback processing
          if (result.isAuthenticated && this.hasAuthCallback()) {
            this.ngZone.run(() => {
              // Navigate to clean URL (remove auth params)
              this.router.navigate(['/'], { replaceUrl: true });
            });
          }

          resolve(result.isAuthenticated);
        },
        error: () => {
          // Silent failure: caller will handle unauthenticated state
          resolve(false);
        },
      });
    });
  }

  /**
   * Check if current URL contains OIDC callback parameters
   */
  private hasAuthCallback(): boolean {
    if (!this.isBrowser) return false;
    const params = new URLSearchParams(window.location.search);
    return params.has('code') && params.has('state');
  }

  async isAuthenticated(): Promise<boolean> {
    if (!this.isBrowser || !this.oidcService) {
      return false;
    }
    return this._isAuthenticated$.value;
  }

  async getToken(): Promise<string | null> {
    if (!this.isBrowser || !this.oidcService) {
      return null;
    }
    return new Promise((resolve) => {
      this.oidcService!.getAccessToken().subscribe({
        next: (token) => resolve(token || null),
        error: () => resolve(null),
      });
    });
  }

  async refreshToken(): Promise<boolean> {
    if (!this.isBrowser || !this.oidcService) {
      return false;
    }
    return new Promise((resolve) => {
      this.oidcService!.forceRefreshSession().subscribe({
        next: (result) => resolve(result.isAuthenticated),
        error: () => resolve(false),
      });
    });
  }

  async login(): Promise<void> {
    if (!this.isBrowser || !this.oidcService) {
      return;
    }

    const customParams: Record<string, string> = {};
    // if (options?.locale) {
    //   customParams['ui_locales'] = options.locale;
    // }

    const path = window.location.pathname === '/login' ? '/' : window.location.pathname;
    const currentPage = window.location.origin + path;
    const redirectUrl = oidcConfig.redirectUrl ?? currentPage;
    this.oidcService.authorize(undefined, {
      redirectUrl,
      customParams,
    });
  }

  async logout(options?: LogoutOptions): Promise<void> {
    if (!this.isBrowser || !this.oidcService) {
      return;
    }
    if (this._isAuthenticated$.value === false) {
      return;
    }
    this.oidcService
      .logoffAndRevokeTokens(undefined, {
        logoffMethod: 'GET',
      })
      .subscribe();
  }

  async getUserProfile(): Promise<UserProfile | null> {
    if (!this.isBrowser || !this.oidcService) {
      return null;
    }

    return new Promise((resolve) => {
      this.oidcService!.getUserData().subscribe({
        next: (userData) => {
          if (!userData) {
            resolve(null);
            return;
          }

          // Parse roles from Keycloak token structure
          const realmRoles = userData.realm_access?.roles ?? [];
          const resourceRoles = Object.values(userData.resource_access ?? {}).flatMap(
            (resource: any) => resource?.roles ?? []
          );
          const roles = [...new Set([...realmRoles, ...resourceRoles])];

          resolve({
            id: userData.sub,
            username: userData.preferred_username,
            email: userData.email,
            firstName: userData.given_name,
            lastName: userData.family_name,
            identityNumber: userData.identityNumber,
            fullName: userData.name,
            roles,
            attributes: userData,
          });
        },
        error: () => resolve(null),
      });
    });
  }

  async hasRole(role: string): Promise<boolean> {
    const profile = await this.getUserProfile();
    return profile?.roles?.includes(role) ?? false;
  }

  async hasAnyRole(roles: string[]): Promise<boolean> {
    const profile = await this.getUserProfile();
    if (!profile?.roles) return false;
    return roles.some((role) => profile.roles!.includes(role));
  }
}
