# Keycloak Authentication - Quick Start Guide

## Backend API Requirements

Your backend must provide these endpoints:

### 1. Login Endpoint
```
POST /api/auth/login
Content-Type: application/json

Request:
{
  "username": "user@example.com",
  "password": "userpassword"
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}

Error Response (401 Unauthorized):
{
  "message": "Invalid credentials"
}
```

### 2. Logout Endpoint
```
POST /api/auth/logout
Content-Type: application/json

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{}
```

### 3. Token Refresh Endpoint
```
POST /api/auth/refresh
Content-Type: application/json

Request:
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

Response (200 OK):
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 900,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer"
}

Error Response (401 Unauthorized):
{
  "message": "Invalid or expired refresh token"
}
```

### 4. User Info Endpoint
```
GET /api/auth/userinfo
Authorization: Bearer {access_token}

Response (200 OK):
{
  "sub": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "email_verified": true,
  "name": "John Doe",
  "preferred_username": "johndoe",
  "given_name": "John",
  "family_name": "Doe",
  "email": "john.doe@example.com"
}

Error Response (401 Unauthorized):
{
  "message": "Invalid or expired token"
}
```

## Configuration

### Step 1: Update Environment Variables

Edit `src/environments/environment.ts` for development:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',  // Your backend URL
  keycloak: {
    url: 'http://localhost:8080/realms/auctions',  // Keycloak realm URL
    realm: 'auctions',                              // Keycloak realm name
    clientId: 'auctions-fe'                         // Frontend client ID
  }
};
```

Edit `src/environments/environment.prod.ts` for production:

```typescript
export const environment = {
  production: true,
  apiUrl: '/api',                      // Relative path in production
  keycloak: {
    url: '/realms/auctions',
    realm: 'auctions',
    clientId: 'auctions-fe'
  }
};
```

### Step 2: Test the Integration

1. Start your backend server
2. Run the Angular app: `npm start`
3. Navigate to `/login`
4. Enter credentials and test login

## Usage Examples

### Protecting Routes

```typescript
// app.routes.ts
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auctions',
    component: Auctions,
    canActivate: [authGuard]  // Require authentication
  }
];
```

### Using Auth in Components

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-profile',
  template: `
    <div>
      @if (isLoggedIn()) {
        <h1>Welcome, {{ user()?.name }}</h1>
        <p>Email: {{ user()?.email }}</p>
        <button (click)="logout()">Logout</button>
      }
    </div>
  `
})
export class Profile {
  private authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn;
  user = this.authService.user;

  async logout(): Promise<void> {
    await this.authService.logout();
  }
}
```

### Making Authenticated API Calls

The HTTP interceptor automatically adds the access token to all requests:

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-auctions',
  template: `...`
})
export class Auctions {
  private http = inject(HttpClient);

  loadAuctions(): void {
    // Token is automatically added by the interceptor
    this.http.get(`${environment.apiUrl}/auctions`).subscribe({
      next: (data) => console.log('Auctions:', data),
      error: (error) => {
        // 401 errors automatically redirect to login
        console.error('Error:', error);
      }
    });
  }
}
```

## Testing Credentials

For development, you can create test users in Keycloak:

1. Open Keycloak Admin Console
2. Navigate to your realm (e.g., "auctions")
3. Go to Users → Add User
4. Set username and email
5. Go to Credentials tab
6. Set password (disable "Temporary" if you don't want to force password change)

Example test user:
- Username: `testuser`
- Password: `Test123!`
- Email: `test@example.com`

## Common Issues

### Issue: CORS Error

**Error:** `Access to XMLHttpRequest at 'http://localhost:8080/api/auth/login' from origin 'http://localhost:4200' has been blocked by CORS policy`

**Solution:** Configure CORS in your backend to allow requests from `http://localhost:4200` (development) and your production domain.

Spring Boot example:
```java
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("http://localhost:4200")
                    .allowedMethods("GET", "POST", "PUT", "DELETE")
                    .allowCredentials(true);
            }
        };
    }
}
```

### Issue: Token Not Sent with Requests

**Solution:** The HTTP interceptor is automatically configured in `app.config.ts`. Verify it's included:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### Issue: 401 Errors Not Redirecting to Login

**Solution:** Ensure MessageService is provided in `app.config.ts`:

```typescript
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    MessageService
  ]
};
```

## API Testing with Postman/cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'
```

### Access Protected Endpoint
```bash
curl -X GET http://localhost:8080/api/auctions \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Refresh Token
```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

### Logout
```bash
curl -X POST http://localhost:8080/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

## Security Checklist

- [ ] Backend validates all tokens with Keycloak
- [ ] HTTPS enabled in production
- [ ] CORS properly configured
- [ ] Tokens have appropriate expiration times
- [ ] Refresh tokens are invalidated on logout
- [ ] Error messages don't expose sensitive information
- [ ] Rate limiting enabled on login endpoint
- [ ] Keycloak realm and clients properly configured

## Next Steps

1. ✅ Configure backend API endpoints
2. ✅ Update environment variables
3. ✅ Test login flow
4. ✅ Protect routes with `authGuard`
5. ✅ Test authenticated API calls
6. ⚠️ Configure production Keycloak instance
7. ⚠️ Set up HTTPS for production
8. ⚠️ Configure proper token expiration times

## Support

For detailed documentation, see [KEYCLOAK_INTEGRATION.md](./KEYCLOAK_INTEGRATION.md)

For project guidelines, see [AI_GUIDELINES.md](./AI_GUIDELINES.md)

