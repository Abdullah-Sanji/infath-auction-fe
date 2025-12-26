import { inject, PLATFORM_ID } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store the attempted URL for redirecting after login
  authService.setRedirectUrl(state.url);

  // Redirect to login page
  return router.createUrlTree(['/login']);
};

/**
 * Guest guard - redirects to home if user is already authenticated.
 * Use this on login/register pages to prevent logged-in users from accessing them.
 * Usage: { path: 'login', canActivate: [guestGuard] }
 */
export const guestOnlyGuard: CanActivateFn = async (route, state) => {
  const platformId = inject(PLATFORM_ID);
  const authService = inject(AuthService);
  const router = inject(Router);
  // Allow access on server-side
  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  // If user is authenticated, redirect to home
  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  // Allow access for guests
  return true;
};

