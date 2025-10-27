# Architecture Documentation

## Overview

This is a modern Angular 19+ application built with standalone components, server-side rendering (SSR), and zoneless change detection using signals.

## Technology Stack

### Core Framework

- **Angular**: 19+ (Standalone Components)
- **TypeScript**: Latest version
- **Node.js**: v18+ (avoid odd versions for production)

### State Management

- **Angular Signals**: Zoneless reactivity
- No NgRx, no external state management libraries
- Computed signals for derived state

### UI & Styling

- **PrimeNG**: Component library
- **Tailwind CSS**: Utility-first styling
- **PrimeIcons**: Icon library

### Forms

- **Template-Driven Forms**: NgModel-based
- No Reactive Forms

### Routing

- **Angular Router**: With lazy loading
- Functional guards (modern approach)

### Testing

- **Jasmine**: Test framework
- **Karma**: Test runner
- **HttpClientTestingModule**: HTTP mocking

### Server-Side Rendering

- **Angular Universal**: SSR support
- Platform checks for browser-only APIs

## Application Structure

```
src/
├── app/
│   ├── core/                           # Core application modules
│   │   ├── guards/                     # Route guards
│   │   │   └── auth.guard.ts
│   │   ├── services/                   # Application-wide services
│   │   │   └── auth.service.ts
│   │   └── interceptors/               # HTTP interceptors (future)
│   │
│   ├── pages/                          # Page components
│   │   ├── home/
│   │   │   ├── home.ts
│   │   │   ├── home.html
│   │   │   ├── home.scss
│   │   │   └── home.spec.ts
│   │   ├── auctions/
│   │   │   ├── auctions.ts
│   │   │   ├── auctions.html
│   │   │   ├── auctions.scss
│   │   │   ├── auctions.spec.ts
│   │   │   ├── auctions.service.ts     # Page-specific service
│   │   │   └── auctions.interface.ts   # Page-specific interfaces
│   │   ├── about/
│   │   └── login/
│   │
│   ├── components/                     # Reusable components
│   │   └── shared/
│   │       ├── auction-card/
│   │       ├── user-avatar/
│   │       └── loading-spinner/
│   │
│   ├── app.ts                          # Root component
│   ├── app.html                        # Root template
│   ├── app.scss                        # Global styles
│   ├── app.routes.ts                   # Route configuration
│   └── app.config.ts                   # App configuration
│
├── styles.css                         # Global styles entry
├── main.ts                             # Browser bootstrap
├── main.server.ts                      # Server bootstrap
└── server.ts                           # Express server
```

## Key Architectural Patterns

### 1. Standalone Components

All components are standalone (no NgModules):

```typescript
@Component({
  selector: 'app-example',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './example.html',
})
export class Example {}
```

### 2. Signal-Based State Management

All reactive state uses signals:

```typescript
export class MyComponent {
  count = signal(0);
  items = signal<Item[]>([]);

  // Derived state
  total = computed(() => this.items().length);
}
```

### 3. Dependency Injection with inject()

Modern injection pattern:

```typescript
export class MyComponent {
  private router = inject(Router);
  private http = inject(HttpClient);
}
```

### 4. Service Scoping

**Root-Level Services** (application-wide):

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {}
```

**Page-Level Services** (component-specific):

```typescript
@Injectable()
export class AuctionPageService {}

@Component({
  providers: [AuctionPageService],
})
export class AuctionPage {}
```

### 5. Lazy Loading Routes

All routes use dynamic imports:

```typescript
{
  path: 'auctions',
  loadComponent: () => import('./pages/auctions/auctions').then(m => m.Auctions)
}
```

### 6. Route Guards

Functional guards for route protection:

```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};
```

## Data Flow

### Component → Service → API

```
User Action
    ↓
Component Method
    ↓
Service Method (inject)
    ↓
HTTP Request
    ↓
API Response
    ↓
Signal Update
    ↓
Template Re-render
```

### Example:

```typescript
// Component
export class AuctionList {
  private service = inject(AuctionListService);
  auctions = signal<Auction[]>([]);

  async loadAuctions(): Promise<void> {
    try {
      const response = await firstValueFrom(this.service.getAuctions());
      this.auctions.set(response.auctions);
    } catch (error) {
      // Handle error
    }
  }
}

// Service
@Injectable()
export class AuctionListService {
  private http = inject(HttpClient);

  getAuctions(): Observable<AuctionResponse> {
    return this.http.get<AuctionResponse>('/api/auctions');
  }
}
```

## State Management Strategy

### Local Component State

Use signals for component-specific state:

```typescript
isLoading = signal(false);
error = signal<string | null>(null);
```

### Shared State

Use root-level services with signals:

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private items = signal<CartItem[]>([]);

  // Exposed as readonly
  readonly cartItems = this.items.asReadonly();

  addItem(item: CartItem): void {
    this.items.update((items) => [...items, item]);
  }
}
```

## SSR Considerations

### Platform Checks

Always check platform for browser-only APIs:

```typescript
export class MyService {
  private platformId = inject(PLATFORM_ID);

  doSomething(): void {
    if (isPlatformBrowser(this.platformId)) {
      // Browser-only code
      window.scrollTo(0, 0);
    }
  }
}
```

### Cookie-Based Storage

Never use localStorage:

```typescript
// ❌ Wrong
localStorage.setItem('token', token);

// ✅ Correct
document.cookie = `token=${token}; path=/; secure; samesite=strict`;
```

## Error Handling Strategy

### API Calls

Always handle errors in API calls:

```typescript
async loadData(): Promise<void> {
  this.isLoading.set(true);
  this.error.set(null);

  try {
    const data = await firstValueFrom(this.service.getData());
    this.data.set(data);
  } catch (error) {
    console.error('Failed to load data:', error);
    this.error.set('Unable to load data. Please try again.');
  } finally {
    this.isLoading.set(false);
  }
}
```

### Global Error Handling

Use HTTP interceptors for global error handling (future implementation).

## Performance Optimization

### Lazy Loading

- All routes are lazy loaded
- Components loaded on-demand

### Change Detection

- Zoneless app with signals
- Automatic change detection optimization
- No manual `ChangeDetectorRef` needed

### Bundle Optimization

- Tree-shaking enabled
- PrimeNG modules imported individually
- Tailwind CSS purging unused styles

## Security Considerations

### Authentication

- JWT tokens in HTTP-only cookies
- Auth guard on protected routes
- Token refresh mechanism (future)

### XSS Prevention

- Angular's built-in sanitization
- No `innerHTML` without sanitization
- CSP headers (future)

### CSRF Protection

- CSRF tokens in forms (future)
- SameSite cookie attribute

## Testing Strategy

### Unit Tests

- Test each component method
- Mock services with jasmine spies
- Test signal state changes

### Integration Tests

- Test component interactions
- Test routing
- Test guards

### E2E Tests (Future)

- Cypress or Playwright
- Critical user flows

## Future Enhancements

1. **State Management**: Consider signals-based state library if needed
2. **Caching**: Implement HTTP caching strategy
3. **Offline Support**: PWA capabilities
4. **Monitoring**: Error tracking (Sentry)
5. **Analytics**: User behavior tracking
6. **Internationalization**: i18n support
7. **Accessibility**: WCAG 2.1 AA compliance
8. **Performance**: Web Vitals optimization

## Deployment

### Build

```bash
npm run build
```

### Server Build

```bash
npm run build:ssr
```

### Production Server

```bash
npm run serve:ssr
```

## Environment Variables

```
API_BASE_URL=https://api.example.com
NODE_ENV=production
PORT=4000
```

## Monitoring & Debugging

### Development

- Angular DevTools
- Browser DevTools
- Source maps enabled

### Production

- Error logging service
- Performance monitoring
- User analytics

---

**Last Updated**: 2025-10-27
**Maintained By**: Development Team
