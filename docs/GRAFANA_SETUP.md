# Grafana Frontend Observability - Quick Setup Guide

## ✅ What's Been Integrated

Grafana Faro (Frontend Observability) has been fully integrated into this Angular application with:

- ✨ **Automatic HTTP Request Tracking** via interceptor
- 🐛 **Automatic Error Tracking** for all JavaScript errors
- 📊 **Performance Monitoring** (Web Vitals: LCP, FID, CLS)
- 👤 **User Session Tracking** with authentication integration
- 📝 **Console Log Capture** (configurable per environment)
- 🎯 **Custom Event Tracking** for business metrics

## 🚀 Quick Start

### 1. Configure Environment Variables

Update `src/environments/environment.prod.ts` with your Grafana Faro collector URL:

```typescript
grafana: {
  enabled: true,
  url: 'https://your-grafana-collector.com/collect', // ← Add your URL here
  appName: 'auctions-fe',
  appVersion: '1.0.0',
  environment: 'production',
  // ... rest of config
}
```

### 2. Get Your Grafana Faro Collector URL

1. Log in to [Grafana Cloud](https://grafana.com/auth/sign-in/)
2. Navigate to **Frontend Observability** (or create new app)
3. Copy your **Collector URL**
4. Paste it into `environment.prod.ts`

### 3. Deploy

That's it! Once deployed, you'll automatically start seeing:

- All HTTP API calls and their performance
- JavaScript errors with stack traces
- Web Vitals metrics
- User sessions and behavior

## 📊 What Gets Tracked Automatically

### HTTP Requests (via Interceptor)
```typescript
// All API calls are automatically tracked - no code changes needed!
this.http.get('/api/auctions').subscribe(...);

// Tracked data:
// - Method (GET, POST, etc.)
// - Endpoint URL
// - Response status (200, 404, 500, etc.)
// - Duration in milliseconds
// - Success/failure state
```

### JavaScript Errors
```typescript
// All errors are automatically caught and reported
throw new Error('Something went wrong');

// Includes:
// - Stack trace
// - User context (if logged in)
// - Page URL
// - Browser info
```

### Web Vitals
- **LCP** - Largest Contentful Paint
- **FID** - First Input Delay  
- **CLS** - Cumulative Layout Shift

### User Context
```typescript
// Automatically set on login (already implemented in AuthService)
// All events are associated with the user
```

## 🎯 Track Custom Business Events

For business-specific events, use `GrafanaService`:

```typescript
import { inject } from '@angular/core';
import { GrafanaService } from '@app/core/services/grafana.service';

export class AuctionComponent {
  private grafanaService = inject(GrafanaService);

  placeBid(auctionId: string, amount: number): void {
    // Your bid logic...
    
    // Track the business event
    this.grafanaService.trackEvent({
      name: 'auction_bid_placed',
      attributes: {
        auctionId,
        amount: amount.toString()
      },
      domain: 'auctions'
    });
  }
}
```

## 📁 Files Added/Modified

### New Files
- `src/app/core/services/grafana.service.ts` - Main Grafana service
- `src/app/core/services/grafana.interface.ts` - TypeScript interfaces
- `src/app/core/services/grafana.service.spec.ts` - Service tests
- `src/app/core/interceptors/grafana.interceptor.ts` - HTTP tracking interceptor
- `src/app/core/interceptors/grafana.interceptor.spec.ts` - Interceptor tests
- `docs/GRAFANA_INTEGRATION.md` - Complete documentation

### Modified Files
- `src/app/app.config.ts` - Added Grafana initialization and interceptor
- `src/app/core/services/auth.service.ts` - Added user tracking on login/logout
- `src/environments/environment.ts` - Added Grafana config
- `src/environments/environment.prod.ts` - Added Grafana config
- `package.json` - Added Grafana Faro dependencies

### Dependencies Added
```json
{
  "@grafana/faro-web-sdk": "^1.x.x",
  "@grafana/faro-web-tracing": "^1.x.x",
  "@grafana/faro-react": "^1.x.x"
}
```

## 🔍 View Your Data

1. Go to [Grafana Cloud](https://grafana.com/auth/sign-in/)
2. Navigate to **Frontend Observability**
3. Select your application (`auctions-fe`)
4. Explore:
   - **Errors** - Real-time error feed with stack traces
   - **Performance** - Web Vitals and API response times
   - **Sessions** - User journey visualization
   - **Events** - Custom business events

## 🛠️ Configuration Options

### Enable/Disable by Environment

```typescript
// Development - capture everything including console logs
grafana: {
  enabled: true,
  instrumentations: {
    errors: true,
    console: true,  // Helpful for debugging
    webVitals: true,
    interactions: true,
    network: true
  }
}

// Production - optimize for performance
grafana: {
  enabled: true,
  instrumentations: {
    errors: true,
    console: false,  // Disable console capture in production
    webVitals: true,
    interactions: true,
    network: true
  }
}
```

### Temporarily Disable

```typescript
// To completely disable Grafana (for testing, debugging, etc.)
grafana: {
  enabled: false,  // ← Set to false
  // ... rest of config doesn't matter when disabled
}
```

## 📖 Full Documentation

For complete documentation, see:
- **[docs/GRAFANA_INTEGRATION.md](docs/GRAFANA_INTEGRATION.md)** - Complete guide with all features

## 🧪 Testing

All functionality is fully tested:

```bash
# Run all tests
npm test

# Test Grafana service
npm test -- --include='**/grafana.service.spec.ts'

# Test Grafana interceptor  
npm test -- --include='**/grafana.interceptor.spec.ts'
```

## ✅ Benefits

### For Developers
- Catch errors before users report them
- Understand API performance issues
- Debug production issues faster
- Track feature usage

### For Product Team
- Monitor user behavior
- Track conversion funnels
- Measure feature adoption
- Identify pain points

### For DevOps
- Monitor application health
- Set up alerts for critical errors
- Track API response times
- Measure Web Vitals trends

## 🔐 Privacy & Security

- All data sent over HTTPS
- User emails/IDs are hashed by default
- Configurable data capture (disable PII if needed)
- GDPR compliant when configured properly
- No passwords or tokens are ever captured

## 🆘 Troubleshooting

### Data Not Appearing in Grafana?

1. Check `grafana.enabled` is `true`
2. Verify `grafana.url` is correct
3. Check browser console for errors
4. Verify network requests to collector URL
5. Ensure you're in browser (not SSR)

### Too Much Data / High Costs?

1. Disable `console` instrumentation in production
2. Use sampling for high-frequency events
3. Filter out non-critical errors
4. Adjust session tracking settings

## 📞 Support

- **Full Documentation**: [docs/GRAFANA_INTEGRATION.md](docs/GRAFANA_INTEGRATION.md)
- **Grafana Docs**: [grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/](https://grafana.com/docs/grafana-cloud/monitor-applications/frontend-observability/)
- **Issues**: Open an issue in the repository

---

**Ready to Go!** 🎉  
Just add your Grafana Faro collector URL and deploy!

