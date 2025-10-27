# Google Tag Manager (GTM) Integration Guide

## Overview

This Angular application integrates Google Tag Manager (GTM) for advanced analytics and tracking. The implementation is SSR-compatible and follows Angular 19+ best practices.

## Features

- ✅ Server-Side Rendering (SSR) compatible
- ✅ Automatic page view tracking on route changes
- ✅ Custom event tracking
- ✅ User interaction tracking
- ✅ Data layer management
- ✅ Environment-based configuration
- ✅ Comprehensive test coverage

## Setup Instructions

### 1. Configure GTM Container ID

Update the GTM container IDs in your environment files:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  // ... other config
  gtm: {
    id: 'GTM-XXXXXXX' // Replace with your development GTM ID
  }
};
```

**Production** (`src/environments/environment.prod.ts`):
```typescript
export const environment = {
  // ... other config
  gtm: {
    id: 'GTM-YYYYYYY' // Replace with your production GTM ID
  }
};
```

### 2. Update index.html

Update the GTM container ID in the noscript fallback (`src/index.html`):
```html
<noscript>
  <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
          height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
```

### 3. GTM Initialization

GTM is automatically initialized when the application starts. The `App` component:
- Initializes GTM on application load
- Tracks page views on every route change
- Only runs in browser environment (SSR-safe)

## Usage

### Automatic Page View Tracking

Page views are automatically tracked on route changes. No additional code required.

### Custom Event Tracking

Inject the `GtmService` and use its methods:

```typescript
import { Component, inject } from '@angular/core';
import { GtmService } from './core/services/gtm.service';

@Component({
  selector: 'app-auction-detail',
  template: `
    <button (click)="onBidClick()">Place Bid</button>
  `
})
export class AuctionDetail {
  private gtmService = inject(GtmService);

  onBidClick(): void {
    this.gtmService.pushEvent('bid_placed', {
      auction_id: '123',
      bid_amount: 100
    });
  }
}
```

### User Interaction Tracking

Track user interactions like clicks, form submissions:

```typescript
onSubmit(): void {
  this.gtmService.pushInteraction(
    'submit',        // action
    'form',          // category
    'contact-form',  // label (optional)
    1                // value (optional)
  );
}

onButtonClick(): void {
  this.gtmService.pushInteraction(
    'click',
    'button',
    'cta-signup'
  );
}
```

### Custom Data Layer Pushes

Push custom data without triggering an event:

```typescript
onUserLogin(user: User): void {
  this.gtmService.pushData({
    userId: user.id,
    userType: user.type,
    isAuthenticated: true
  });
}
```

## GtmService API

### Methods

#### `initialize(): void`
Initializes GTM. Called automatically by the app component.
- Only runs in browser environment
- Skips if GTM ID is not configured or invalid
- Prevents double initialization

#### `pushEvent(event: string, data?: Record<string, any>): void`
Pushes a custom event to the data layer.

**Parameters:**
- `event`: Event name (e.g., 'purchase', 'signup')
- `data`: Additional event data (optional)

**Example:**
```typescript
this.gtmService.pushEvent('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [
    { id: 'item-1', name: 'Product', price: 99.99 }
  ]
});
```

#### `pushPageView(url: string, title: string): void`
Pushes a page view event. Called automatically on route changes.

**Parameters:**
- `url`: Page URL
- `title`: Page title

#### `pushInteraction(action: string, category: string, label?: string, value?: number): void`
Pushes a user interaction event.

**Parameters:**
- `action`: User action (e.g., 'click', 'submit', 'scroll')
- `category`: Event category (e.g., 'button', 'form', 'video')
- `label`: Event label (optional)
- `value`: Numeric value (optional)

**Example:**
```typescript
this.gtmService.pushInteraction('click', 'button', 'buy-now', 1);
```

#### `pushData(data: Record<string, any>): void`
Pushes custom data to the data layer without triggering an event.

**Parameters:**
- `data`: Custom data object

**Example:**
```typescript
this.gtmService.pushData({
  experiment_id: 'exp-123',
  variant: 'A'
});
```

#### `get initialized(): boolean`
Returns whether GTM has been initialized.

## Common Use Cases

### E-commerce Tracking

```typescript
// Product view
this.gtmService.pushEvent('view_item', {
  currency: 'USD',
  value: 99.99,
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    price: 99.99
  }]
});

// Add to cart
this.gtmService.pushEvent('add_to_cart', {
  currency: 'USD',
  value: 99.99,
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    quantity: 1
  }]
});

// Purchase
this.gtmService.pushEvent('purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  tax: 8.00,
  shipping: 5.00,
  items: [{
    item_id: 'SKU123',
    item_name: 'Product Name',
    quantity: 1,
    price: 99.99
  }]
});
```

### User Authentication Tracking

```typescript
// User login
onLogin(user: User): void {
  this.gtmService.pushEvent('login', {
    method: 'email'
  });

  this.gtmService.pushData({
    user_id: user.id,
    user_type: user.type
  });
}

// User signup
onSignup(user: User): void {
  this.gtmService.pushEvent('sign_up', {
    method: 'email'
  });
}

// User logout
onLogout(): void {
  this.gtmService.pushEvent('logout');
}
```

### Form Tracking

```typescript
// Form start
onFormStart(): void {
  this.gtmService.pushEvent('form_start', {
    form_id: 'contact-form',
    form_name: 'Contact Form'
  });
}

// Form submission
onFormSubmit(): void {
  this.gtmService.pushEvent('form_submit', {
    form_id: 'contact-form',
    form_name: 'Contact Form'
  });
}

// Form error
onFormError(error: string): void {
  this.gtmService.pushEvent('form_error', {
    form_id: 'contact-form',
    error_message: error
  });
}
```

### Video Tracking

```typescript
onVideoPlay(videoId: string): void {
  this.gtmService.pushInteraction('play', 'video', videoId);
}

onVideoComplete(videoId: string): void {
  this.gtmService.pushInteraction('complete', 'video', videoId);
}
```

### Search Tracking

```typescript
onSearch(query: string, results: number): void {
  this.gtmService.pushEvent('search', {
    search_term: query,
    result_count: results
  });
}
```

## SSR Considerations

The GTM service is fully SSR-compatible:

1. **Platform Detection**: Uses `isPlatformBrowser()` to ensure GTM only runs in the browser
2. **Safe Initialization**: All window/document access is wrapped in platform checks
3. **No Server Errors**: Methods silently return when called on the server

## Debugging

### Check GTM Initialization

Open browser console and check for:
```
GTM: Initialized with container ID GTM-XXXXXXX
```

### View Data Layer

In browser console:
```javascript
console.log(window.dataLayer);
```

### GTM Preview Mode

1. In GTM console, click "Preview"
2. Enter your site URL
3. Browse your site to see events in real-time

### Google Tag Assistant

Install the [Google Tag Assistant Chrome Extension](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) to debug GTM implementation.

## Testing

The GTM service includes comprehensive tests. Run tests with:

```bash
npm test
```

Key test scenarios:
- ✅ Service creation
- ✅ Platform detection (browser vs server)
- ✅ Initialization logic
- ✅ Event pushing
- ✅ Data layer interaction
- ✅ Error handling
- ✅ Double initialization prevention

## Security Best Practices

1. **Never send PII**: Don't send personally identifiable information (email, phone, SSN) to GTM
2. **Sanitize data**: Always sanitize user input before sending to GTM
3. **Use consent mode**: Implement Google Consent Mode for GDPR compliance
4. **Restrict access**: Limit GTM container access to authorized personnel only

## Troubleshooting

### GTM Not Loading

**Check:**
1. GTM container ID is correct in environment files
2. Browser console for initialization message
3. Network tab for GTM script load
4. Ad blockers are disabled (they often block GTM)

### Events Not Firing

**Check:**
1. GTM is initialized: `gtmService.initialized`
2. Browser console for "GTM: Event pushed" messages
3. Data layer in browser console: `window.dataLayer`
4. GTM Preview mode to see events in real-time

### SSR Errors

If you see errors like "window is not defined":
1. Ensure you're using `GtmService` (not direct window access)
2. Check platform detection is working
3. Verify all browser-specific code is wrapped in `isPlatformBrowser()` checks

## Additional Resources

- [Google Tag Manager Documentation](https://developers.google.com/tag-manager)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [GTM Best Practices](https://developers.google.com/tag-manager/devguide)
- [Google Consent Mode](https://developers.google.com/tag-platform/devguides/consent)

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify GTM container ID configuration
3. Test in GTM Preview mode
4. Review this documentation
5. Contact the development team

---

**Last Updated**: 2025-10-27
**GTM Service Version**: 1.0.0

