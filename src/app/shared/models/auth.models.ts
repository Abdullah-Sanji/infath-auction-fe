/**
 * User profile information from SSO provider
 */
export interface UserProfile {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phoneNumber?: string;
  identityNumber?: string;
  roles?: string[];
  attributes?: Record<string, unknown>;
}

/**
 * Authentication state
 */
export interface AuthState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: UserProfile | null;
}

/**
 * Login options for SSO providers
 */
export interface LoginOptions {
  redirectUri?: string;
  prompt?: 'login' | 'none' | 'consent';
  locale?: string;
  idpHint?: string;
}

/**
 * Logout options for SSO providers
 */
export interface LogoutOptions {
  redirectUri?: string;
}

/**
 * SSO Provider configuration
 */
export interface SsoProviderConfig {
  /** Provider type identifier */
  provider: 'keycloak' | 'auth0' | 'okta' | 'azure-ad' | 'custom';
  /** Provider-specific configuration */
  config: Record<string, unknown>;
  /** Initialization options */
  initOptions?: Record<string, unknown>;
}

/**
 * Interface for SSO provider implementations.
 * Implement this interface to add support for new SSO providers.
 */
export interface SsoProvider {
  /** Provider name for logging/debugging */
  readonly name: string;

  /** Initialize the SSO provider */
  init(): Promise<boolean>;

  /** Check if user is authenticated */
  isAuthenticated(): Promise<boolean>;

  /** Get current access token */
  getToken(): Promise<string | null>;

  /** Refresh the access token */
  refreshToken(): Promise<boolean>;

  /** Trigger login flow */
  login(options?: LoginOptions): Promise<void>;

  /** Trigger logout flow */
  logout(options?: LogoutOptions): Promise<void>;

  /** Get user profile */
  getUserProfile(): Promise<UserProfile | null>;

  /** Check if user has a specific role */
  hasRole(role: string): Promise<boolean>;

  /** Check if user has any of the specified roles */
  hasAnyRole(roles: string[]): Promise<boolean>;

  /**
   * Register a callback for authentication state changes.
   * This is optional - providers that support reactive auth state should implement this.
   */
  onAuthChange?(callback: (authenticated: boolean) => void): void;
}
