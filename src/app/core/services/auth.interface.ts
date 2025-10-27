/**
 * User information from Keycloak
 */
export interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  username: string;
  emailVerified?: boolean;
  roles?: string[];
}

/**
 * Keycloak login request
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Keycloak token response
 */
export interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy'?: number;
  session_state?: string;
  scope?: string;
}

/**
 * Keycloak refresh token request
 */
export interface RefreshTokenRequest {
  refresh_token: string;
}

/**
 * User info response from Keycloak
 */
export interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email: string;
}

