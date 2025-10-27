# Grafana Frontend Observability Integration

## Overview

This Angular application is integrated with **Grafana Faro**, a frontend observability solution that provides:

- 🐛 **Real-time Error Tracking** - Automatic capture of JavaScript errors and exceptions
- 📊 **Performance Monitoring** - Web Vitals (LCP, FID, CLS) and custom metrics
- 🌐 **HTTP Request Tracking** - Automatic monitoring of all API calls
- 👤 **User Session Tracking** - Track user journeys and behavior
- 📝 **Console Log Capture** - Capture console logs for debugging
- 🔍 **Custom Event Tracking** - Track business-critical events

## Architecture

### Components

1. **GrafanaService** (`src/app/core/services/grafana.service.ts`)
   - Main service for Grafana Faro integration
   - Provides methods for tracking events, errors, and performance
   - Handles initialization and configuration

2. **Grafana HTTP Interceptor** (`src/app/core/interceptors/grafana.interceptor.ts`)
   - **Automatically tracks ALL HTTP requests** (no manual tracking needed)
   - Captures request duration, status codes, and errors
   - Runs before auth interceptor to ensure all requests are tracked

3. **Environment Configuration** (`src/environments/*.ts`)
   - Grafana Faro collector URL
   - Feature flags for different instrumentations
   - Environment-specific settings

### How It Works

```
Application Startup
  └─> APP_INITIALIZER (app.config.ts)
        └─> GrafanaService.initialize()
              └─> Grafana Faro SDK initialized
                    └─> Instrumentations activated

HTTP Request Made
  └─> Grafana Interceptor (runs first)
        ├─> Records start time
        ├─> Tracks request event
        ├─> Tracks performance metrics
        └─> Tracks errors if request fails
              └─> Auth Interceptor (runs second)
```

## Configuration

### 1. Environment Variables

Configure Grafana settings in `src/environments/environment.ts` and `environment.prod.ts`:

```typescript
export const environment = {
  // ... other config
  grafana: {
    enabled: true, // Enable/disable Grafana tracking
    url: 'https://your-grafana-collector.com/collect', // Grafana Faro collector URL
    appName: 'auctions-fe', // Your application name
    appVersion: '1.0.0', // Current version
    environment: 'production', // Environment name
    
    // Session tracking configuration
    sessionTracking: {
      enabled: true,
      persistent: true // Persist across page reloads
    },
    
    // Instrumentations - what data to collect
    instrumentations: {
      errors: true,       // Track JavaScript errors
      console: false,     // Capture console logs (disable in production)
      webVitals: true,    // Track Core Web Vitals
      interactions: true, // Track user interactions
      network: true       // Track network requests
    }
  }
};
```

### 2. Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `grafana.url` | Grafana Faro collector endpoint | `https://faro-collector.grafana.com/collect` |
| `grafana.appName` | Application identifier | `auctions-fe` |
| `grafana.appVersion` | Current version | `1.0.0` |
| `grafana.environment` | Environment name | `production`, `development`, `staging` |

### 3. Getting Your Grafana Faro Collector URL

1. Log in to Grafana Cloud
2. Navigate to **Frontend Observability**
3. Create a new application or select existing
4. Copy the **Collector URL** from the integration page
5. Update `environment.prod.ts` with your URL

## Usage

### Automatic Tracking (No Code Required)

The following are **automatically tracked** without any code changes:

#### ✅ All HTTP Requests
```typescript
// This is automatically tracked by Grafana Interceptor
this.http.get('/api/auctions').subscribe(...);
```

**Tracked Data:**
- HTTP method (GET, POST, PUT, DELETE)
- Endpoint URL
- Response status code
- Request duration
- Success/failure state
- Error details (if request fails)

#### ✅ JavaScript Errors
```typescript
// Any uncaught errors are automatically tracked
throw new Error('Something went wrong');
```

#### ✅ Web Vitals
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)

#### ✅ Console Logs
```typescript
// In development, console logs are captured
console.error('API failed', error);
console.warn('Deprecated feature used');
```

### Manual Tracking (Domain-Specific Events)

For business-critical events, use the `GrafanaService` directly:

#### Track Custom Events

```typescript
import { inject } from '@angular/core';
import { GrafanaService } from '@app/core/services/grafana.service';

export class AuctionComponent {
  private grafanaService = inject(GrafanaService);

  placeBid(auctionId: string, amount: number): void {
    // ... bid logic ...
    
    // Track the business event
    this.grafanaService.trackEvent({
      name: 'auction_bid_placed',
      attributes: {
        auctionId,
        amount: amount.toString(),
        currency: 'USD'
      },
      domain: 'auctions'
    });
  }
}
```

#### Track Errors with Context

```typescript
async loadAuctions(): Promise<void> {
  try {
    this.auctions.set(await this.fetchAuctions());
  } catch (error) {
    // Track error with additional context
    this.grafanaService.trackError(error as Error, {
      context: 'auction_loading',
      attributes: {
        page: 'home',
        userId: this.currentUser()?.id || 'anonymous'
      }
    });
  }
}
```

#### Track Performance Metrics

```typescript
async performHeavyOperation(): Promise<void> {
  const startTime = performance.now();
  
  // ... operation ...
  
  const duration = performance.now() - startTime;
  
  this.grafanaService.trackPerformance({
    name: 'heavy_operation_duration',
    value: duration,
    attributes: {
      operation: 'image_processing',
      itemCount: '100'
    }
  });
}
```

#### Track User Context

```typescript
// In AuthService (already implemented)
private async fetchUserInfo(): Promise<void> {
  const user = await this.getUserFromAPI();
  
  // Associate all future events with this user
  this.grafanaService.setUser({
    id: user.id,
    email: user.email,
    username: user.username
  });
}
```

#### Clear User Context

```typescript
async logout(): Promise<void> {
  // ... logout logic ...
  
  // Clear user context
  this.grafanaService.clearUser();
}
```

## API Reference

### GrafanaService Methods

#### `initialize(config: GrafanaConfig): void`
Initialize Grafana Faro with configuration. Called automatically on app startup.

#### `setUser(user: GrafanaUserContext): void`
Associate all future events with a user.

```typescript
setUser({
  id: 'user-123',
  email: 'user@example.com',
  username: 'johndoe',
  attributes: {
    role: 'premium',
    accountType: 'business'
  }
});
```

#### `clearUser(): void`
Clear user context (call on logout).

#### `trackEvent(event: GrafanaCustomEvent): void`
Track a custom business event.

```typescript
trackEvent({
  name: 'feature_used',
  attributes: {
    feature: 'advanced_search',
    filters: '3'
  },
  domain: 'features'
});
```

#### `trackError(error: Error | string, context?: GrafanaErrorContext): void`
Manually track an error with context.

```typescript
trackError(error, {
  context: 'payment_processing',
  attributes: {
    orderId: '12345',
    amount: '99.99'
  }
});
```

#### `trackPerformance(measurement: GrafanaPerformanceMeasurement): void`
Track custom performance metrics.

```typescript
trackPerformance({
  name: 'search_query_time',
  value: 250, // milliseconds
  attributes: {
    query: 'electronics',
    resultsCount: '45'
  }
});
```

#### `trackPageView(pageName: string, attributes?: Record<string, string>): void`
Manually track page views (normally automatic).

```typescript
trackPageView('/auctions/123', {
  category: 'electronics',
  featured: 'true'
});
```

#### `setGlobalAttributes(attributes: Record<string, string>): void`
Set attributes that are attached to all future events.

```typescript
setGlobalAttributes({
  tenant: 'acme-corp',
  deployment: 'us-west-1'
});
```

#### `pause(): void`
Temporarily pause data collection (for privacy-sensitive operations).

#### `unpause(): void`
Resume data collection after pausing.

## Best Practices

### ✅ DO:

1. **Use the Interceptor for HTTP Tracking**
   - All API calls are automatically tracked
   - No need to manually track in services

2. **Track Business Events**
   - User actions (bid placed, item favorited)
   - Feature usage (filter applied, search performed)
   - Conversion events (checkout completed, subscription started)

3. **Add Context to Errors**
   - Always include relevant context when tracking errors
   - Add user ID, page, and operation details

4. **Use Meaningful Event Names**
   - Use `snake_case` for event names
   - Be descriptive: `auction_bid_placed` not `bid`

5. **Track Performance for Critical Operations**
   - Search queries
   - Image uploads
   - Complex calculations
   - Data transformations

### ❌ DON'T:

1. **Don't Track Every Function Call**
   - Only track meaningful business events
   - Avoid noise in your data

2. **Don't Track PII Without Consent**
   - Be mindful of privacy regulations (GDPR, CCPA)
   - Hash or anonymize sensitive data

3. **Don't Track Passwords or Tokens**
   - Never send authentication credentials
   - Filter out sensitive headers

4. **Don't Block User Actions**
   - All tracking is non-blocking
   - Don't `await` tracking calls

## Grafana Cloud Dashboard

### Viewing Your Data

1. **Errors Dashboard**
   - Real-time error feed
   - Error grouping and frequency
   - Stack traces and user context

2. **Performance Dashboard**
   - Web Vitals trends
   - API response times
   - Custom performance metrics

3. **User Sessions**
   - User journey visualization
   - Session replay (if enabled)
   - User behavior patterns

4. **Custom Events**
   - Business metric trends
   - Feature usage analytics
   - Conversion funnels

### Creating Alerts

Example: Alert on high error rate

```
WHEN error_count > 50
WITHIN 5 minutes
THEN notify #engineering
```

Example: Alert on slow API responses

```
WHEN p95(api_call_duration) > 3000ms
FOR endpoint = '/api/auctions'
THEN notify #backend-team
```

## Troubleshooting

### Grafana Not Initializing

**Problem:** No data appearing in Grafana Cloud

**Solutions:**
1. Check `environment.grafana.enabled` is `true`
2. Verify `grafana.url` is correct
3. Check browser console for initialization errors
4. Ensure you're in browser environment (not SSR)

```typescript
// Check initialization status
if (!grafanaService.isInitialized()) {
  console.error('Grafana not initialized');
}
```

### Events Not Being Tracked

**Problem:** Custom events not appearing in Grafana

**Solutions:**
1. Verify Grafana is initialized
2. Check network tab for requests to collector URL
3. Ensure attributes are strings, numbers, or booleans
4. Check for CORS issues with collector URL

### Too Much Data / High Costs

**Problem:** Sending too many events to Grafana

**Solutions:**
1. Disable `console` instrumentation in production
2. Sample high-frequency events
3. Filter out non-critical error types
4. Use performance sampling

```typescript
// Example: Sample 10% of events
if (Math.random() < 0.1) {
  grafanaService.trackEvent({...});
}
```

## Testing

All Grafana functionality is fully tested:

- `grafana.service.spec.ts` - Service unit tests
- `grafana.interceptor.spec.ts` - Interceptor integration tests

Run tests:
```bash
npm test
```

## SSR Compatibility

✅ This integration is **fully SSR-compatible**:

- Grafana only initializes in browser environment
- Platform checks prevent server-side execution
- No `localStorage` or `window` access during SSR
- All tracking methods safely no-op on server

## Security Considerations

1. **HTTPS Only**
   - Always use HTTPS for collector URL
   - Ensure secure data transmission

2. **Data Sanitization**
   - Filter sensitive data before tracking
   - Don't send passwords, tokens, or PII

3. **CORS Configuration**
   - Ensure Grafana collector allows your domain
   - Configure proper CORS headers

4. **Rate Limiting**
   - Grafana has built-in rate limiting
   - Excessive requests may be throttled

## Performance Impact

Grafana Faro has **minimal performance impact**:

- Async data collection (non-blocking)
- Batched network requests
- Compressed payloads
- < 50KB bundle size
- No impact on page load time

## Migration Guide

If you need to migrate from another observability tool:

### From Sentry

```typescript
// Sentry
Sentry.captureException(error);

// Grafana
grafanaService.trackError(error);
```

### From Google Analytics

```typescript
// GA
gtag('event', 'purchase', { value: 99.99 });

// Grafana
grafanaService.trackEvent({
  name: 'purchase_completed',
  attributes: { value: '99.99' }
});
```

## Additional Resources

- [Grafana Faro Documentation](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/)
- [Grafana Cloud](https://grafana.com/products/cloud/)
- [Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)

## Support

For issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review Grafana Cloud documentation
3. Contact your team lead or DevOps team
4. Open an issue in the project repository

---

**Last Updated:** 2025-10-27  
**Version:** 1.0.0  
**Maintained By:** Engineering Team

