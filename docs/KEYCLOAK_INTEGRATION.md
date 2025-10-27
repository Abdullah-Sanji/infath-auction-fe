# Keycloak Authentication Integration

This document describes the Keycloak authentication integration in the Auctions Frontend application.

## Overview

The application uses Keycloak as its Identity and Access Management (IAM) solution. All authentication is handled through the backend API, which communicates with Keycloak.

## Architecture

```
┌─────────────┐      ┌─────────────┐      ┌──────────────┐
│   Angular   │─────▶│   Backend   │─────▶│   Keycloak   │
│   Frontend  │◀─────│     API     │◀─────│    Server    │
└─────────────┘      └─────────────┘      └──────────────┘
     │
     ▼
┌─────────────┐
│   Cookies   │
│  (Tokens)   │
└─────────────┘
```

### Flow

1. **Login**: User enters credentials → Frontend sends to Backend → Backend authenticates with Keycloak → Backend returns tokens → Frontend stores tokens in cookies
2. **API Requests**: Frontend includes access token in Authorization header via HTTP interceptor
3. **Token Refresh**: When access token expires, frontend uses refresh token to get new access token
4. **Logout**: Frontend sends logout request to backend → Backend invalidates session in Keycloak → Frontend clears cookies

## Configuration

### Environment Variables

#### Development (`src/environments/environment.ts`)

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  keycloak: {
    url: 'http://localhost:8080/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe'
  }
};
```

#### Production (`src/environments/environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  apiUrl: '/api',
  keycloak: {
    url: '/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe'
  }
};
```

### Backend API Endpoints

The frontend expects these endpoints to be available:

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/login` | POST | Authenticate user | `{ username, password }` | `TokenResponse` |
| `/api/auth/logout` | POST | Logout user | `{ refresh_token }` | `{}` |
| `/api/auth/refresh` | POST | Refresh access token | `{ refresh_token }` | `TokenResponse` |
| `/api/auth/userinfo` | GET | Get user information | - | `KeycloakUserInfo` |

### Token Response Structure

```typescript
interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  'not-before-policy'?: number;
  session_state?: string;
  scope?: string;
}
```

### User Info Structure

```typescript
interface KeycloakUserInfo {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name?: string;
  family_name?: string;
  email: string;
}
```

## Implementation Details

### Auth Service

Location: `src/app/core/services/auth.service.ts`

Key methods:
- `login(username, password)`: Authenticates user with Keycloak via backend
- `logout()`: Logs out user and clears session
- `refreshToken()`: Refreshes access token using refresh token
- `isAuthenticated()`: Check if user is authenticated
- `getCurrentUser()`: Get current user information

### Cookie Storage

Location: `src/app/core/utils/cookie.util.ts`

Tokens are stored in secure, HTTP-only cookies:
- `access_token`: JWT access token for API requests
- `refresh_token`: JWT refresh token for renewing access token
- `currentUser`: User profile information

Cookie attributes:
- `secure`: Only transmitted over HTTPS (in production)
- `samesite=strict`: Prevents CSRF attacks
- `path=/`: Available throughout the application
- `max-age`: Set based on token expiration time

### HTTP Interceptor

Location: `src/app/core/interceptors/auth.interceptor.ts`

Automatically:
- Attaches access token to all API requests
- Handles 401 (Unauthorized) responses by redirecting to login
- Shows error messages for authentication failures

### Auth Guard

Location: `src/app/core/guards/auth.guard.ts`

Protects routes that require authentication:
```typescript
{
  path: 'auctions',
  component: Auctions,
  canActivate: [authGuard]
}
```

## Usage in Components

### Login Component

```typescript
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = signal('');
  password = signal('');
  errorMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  async onSubmit(): Promise<void> {
    this.errorMessage.set('');
    this.isLoading.set(true);

    try {
      const success = await this.authService.login(
        this.username(),
        this.password()
      );

      if (success) {
        const redirectUrl = this.authService.getRedirectUrl();
        await this.router.navigate([redirectUrl]);
      } else {
        this.errorMessage.set('Invalid username or password.');
      }
    } catch (error) {
      this.errorMessage.set('Unable to connect to authentication service.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

### Using Auth State in Components

```typescript
export class Header {
  private authService = inject(AuthService);

  // Reactive signals
  isLoggedIn = this.authService.isLoggedIn;
  user = this.authService.user;

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
```

## Security Considerations

### Token Storage

✅ **Secure cookies** - Tokens stored in secure, HTTP-only cookies  
✅ **No localStorage** - Avoids XSS vulnerabilities in SSR application  
✅ **SameSite protection** - Prevents CSRF attacks  

### Token Expiration

- Access tokens expire after a configured time (typically 5-15 minutes)
- Refresh tokens have longer expiration (typically hours or days)
- Frontend automatically refreshes access token using refresh token
- User is logged out when refresh token expires

### HTTPS

⚠️ **Important**: In production, always use HTTPS to protect tokens in transit.

The `secure` flag on cookies ensures they're only sent over HTTPS.

## Error Handling

### Login Errors

| Scenario | Handling |
|----------|----------|
| Invalid credentials | Display user-friendly error message |
| Network error | Display "Unable to connect" message |
| Server error | Display "Try again later" message |

### API Request Errors

| Status Code | Action |
|-------------|--------|
| 401 Unauthorized | Redirect to login page |
| 400 Bad Request | Display error message from backend |
| 500 Server Error | Display generic error message |

## Testing

### Auth Service Tests

Location: `src/app/core/services/auth.service.spec.ts`

Tests cover:
- Successful login
- Failed login
- Logout
- Token refresh
- Error handling
- Cookie management

### Login Component Tests

Location: `src/app/pages/login/login.spec.ts`

Tests cover:
- Component initialization
- Form submission
- Success and error states
- Loading states
- Redirect after login

## Troubleshooting

### Issue: "Unable to connect to authentication service"

**Causes:**
- Backend API is not running
- Wrong API URL in environment configuration
- CORS issues

**Solutions:**
1. Verify backend is running
2. Check `environment.apiUrl` configuration
3. Ensure backend allows CORS from frontend origin

### Issue: "Invalid username or password"

**Causes:**
- Incorrect credentials
- User doesn't exist in Keycloak
- Keycloak realm/client misconfiguration

**Solutions:**
1. Verify credentials are correct
2. Check user exists in Keycloak admin console
3. Verify Keycloak realm and client configuration

### Issue: Token refresh fails

**Causes:**
- Refresh token expired
- Backend session invalidated
- Keycloak session expired

**Solutions:**
1. User must log in again
2. Check token expiration settings in Keycloak
3. Verify backend session management

### Issue: Cookies not persisting

**Causes:**
- Browser blocking cookies
- Incorrect cookie settings
- SSR hydration issues

**Solutions:**
1. Check browser cookie settings
2. Verify cookie attributes (secure, samesite, path)
3. Check for console errors related to cookies

## Keycloak Backend Setup Requirements

The backend should handle:

1. **Token Exchange**: Convert username/password to Keycloak tokens
2. **Token Validation**: Validate access tokens on protected endpoints
3. **Token Refresh**: Exchange refresh token for new access token
4. **Logout**: Invalidate Keycloak session
5. **User Info**: Fetch user profile from Keycloak

Example backend endpoints (Spring Boot):

```java
@PostMapping("/auth/login")
public TokenResponse login(@RequestBody LoginRequest request) {
    // Authenticate with Keycloak
    // Return token response
}

@PostMapping("/auth/logout")
public void logout(@RequestBody RefreshTokenRequest request) {
    // Invalidate Keycloak session
}

@PostMapping("/auth/refresh")
public TokenResponse refresh(@RequestBody RefreshTokenRequest request) {
    // Exchange refresh token for new access token
}

@GetMapping("/auth/userinfo")
public KeycloakUserInfo getUserInfo(@RequestHeader("Authorization") String token) {
    // Fetch user info from Keycloak
}
```

## Migration from Mock Auth

If migrating from mock authentication:

1. ✅ Update environment variables
2. ✅ Update `AuthService` to use HTTP calls
3. ✅ Create `auth.interface.ts` with proper types
4. ✅ Update login component to handle async operations
5. ✅ Test with actual Keycloak backend
6. ⚠️ Remove any mock token generation code
7. ⚠️ Update tests to mock HTTP calls instead of synchronous methods

## Additional Resources

- [Keycloak Documentation](https://www.keycloak.org/documentation)
- [Keycloak REST API](https://www.keycloak.org/docs-api/latest/rest-api/)
- [Angular HTTP Client](https://angular.dev/guide/http)
- [Angular Security Best Practices](https://angular.dev/best-practices/security)

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review Keycloak logs on backend
3. Check browser console for errors
4. Verify network requests in browser DevTools

---

**Last Updated**: 2025-10-27  
**Angular Version**: 19+  
**Keycloak Version**: Compatible with standard OAuth2/OIDC flows

