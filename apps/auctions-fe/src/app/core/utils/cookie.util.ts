/**
 * Check if code is running in browser
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Set a cookie with proper security settings for SSR
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Maximum age in seconds
 */
export function setCookie(name: string, value: string, maxAge: number): void {
  if (!isBrowser()) {
    return;
  }

  const cookieValue = encodeURIComponent(value);
  const cookieString = `${name}=${cookieValue}; path=/; max-age=${maxAge}; secure; samesite=strict`;
  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 * @param name - Cookie name
 * @returns Cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

/**
 * Delete a cookie by setting its max-age to 0
 * @param name - Cookie name to delete
 */
export function deleteCookie(name: string): void {
  if (!isBrowser()) {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; secure; samesite=strict`;
}

/**
 * Get the access token from cookies
 * @returns Access token or null if not found
 */
export function getAccessToken(): string | null {
  return getCookie('access_token');
}

/**
 * Get the refresh token from cookies
 * @returns Refresh token or null if not found
 */
export function getRefreshToken(): string | null {
  return getCookie('refresh_token');
}
