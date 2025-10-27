# GTM Integration - Code Examples

This document provides real-world code examples for integrating GTM tracking into your Angular components.

## Basic Component with GTM Tracking

```typescript
import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { GtmService } from '../../core/services/gtm.service';

@Component({
  selector: 'app-auction-card',
  imports: [ButtonModule],
  template: `
    <div class="auction-card p-4 border rounded">
      <h3>{{ auction().title }}</h3>
      <p>Current Bid: \${{ auction().currentBid }}</p>
      <p-button
        label="Place Bid"
        (onClick)="onBidClick()"
      ></p-button>
      <p-button
        label="View Details"
        (onClick)="onViewDetails()"
        severity="secondary"
      ></p-button>
    </div>
  `
})
export class AuctionCard {
  private gtmService = inject(GtmService);

  auction = input.required<Auction>();
  onBid = output<Auction>();

  onBidClick(): void {
    // Track bid interaction
    this.gtmService.pushInteraction(
      'click',
      'button',
      'bid-button',
      1
    );

    // Track custom bid event
    this.gtmService.pushEvent('bid_initiated', {
      auction_id: this.auction().id,
      auction_title: this.auction().title,
      current_bid: this.auction().currentBid
    });

    this.onBid.emit(this.auction());
  }

  onViewDetails(): void {
    this.gtmService.pushInteraction(
      'click',
      'button',
      'view-details-button'
    );
  }
}
```

## Form with GTM Tracking

```typescript
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { GtmService } from '../../core/services/gtm.service';

@Component({
  selector: 'app-contact-form',
  imports: [FormsModule, InputTextModule, ButtonModule],
  template: `
    <form
      #contactForm="ngForm"
      (ngSubmit)="onSubmit()"
      class="p-4"
    >
      <div class="mb-4">
        <label>Name</label>
        <input
          pInputText
          [(ngModel)]="name"
          name="name"
          required
          (focus)="onFormStart()"
        />
      </div>
      
      <div class="mb-4">
        <label>Email</label>
        <input
          pInputText
          type="email"
          [(ngModel)]="email"
          name="email"
          required
          email
        />
      </div>

      <p-button
        type="submit"
        label="Submit"
        [disabled]="contactForm.invalid || isSubmitting()"
      ></p-button>

      @if (error()) {
        <p class="text-red-500 mt-2">{{ error() }}</p>
      }
    </form>
  `
})
export class ContactForm {
  private gtmService = inject(GtmService);

  name = signal('');
  email = signal('');
  isSubmitting = signal(false);
  error = signal<string | null>(null);
  formStarted = signal(false);

  onFormStart(): void {
    if (this.formStarted()) return;

    this.gtmService.pushEvent('form_start', {
      form_id: 'contact-form',
      form_name: 'Contact Form'
    });

    this.formStarted.set(true);
  }

  async onSubmit(): Promise<void> {
    this.isSubmitting.set(true);
    this.error.set(null);

    try {
      // Simulate API call
      await this.submitForm();

      // Track successful submission
      this.gtmService.pushEvent('form_submit', {
        form_id: 'contact-form',
        form_name: 'Contact Form',
        success: true
      });

      this.gtmService.pushInteraction(
        'submit',
        'form',
        'contact-form-success'
      );

      // Reset form
      this.name.set('');
      this.email.set('');
      this.formStarted.set(false);
    } catch (error) {
      this.error.set('Failed to submit form');

      // Track form error
      this.gtmService.pushEvent('form_error', {
        form_id: 'contact-form',
        form_name: 'Contact Form',
        error_message: 'Submission failed'
      });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private async submitForm(): Promise<void> {
    // Your API call here
  }
}
```

## Search Component with GTM Tracking

```typescript
import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { GtmService } from '../../core/services/gtm.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, InputTextModule, ButtonModule],
  template: `
    <div class="search-container p-4">
      <form (ngSubmit)="onSearch()" class="flex gap-2">
        <input
          pInputText
          [(ngModel)]="searchQuery"
          name="search"
          placeholder="Search auctions..."
          class="flex-1"
        />
        <p-button
          type="submit"
          icon="pi pi-search"
          label="Search"
        ></p-button>
      </form>

      @if (results().length > 0) {
        <div class="mt-4">
          <p>Found {{ results().length }} results</p>
        </div>
      }
    </div>
  `
})
export class Search {
  private gtmService = inject(GtmService);

  searchQuery = signal('');
  results = signal<any[]>([]);

  async onSearch(): Promise<void> {
    const query = this.searchQuery().trim();
    if (!query) return;

    try {
      // Simulate search API call
      const results = await this.performSearch(query);
      this.results.set(results);

      // Track search event
      this.gtmService.pushEvent('search', {
        search_term: query,
        result_count: results.length,
        search_type: 'auctions'
      });

      this.gtmService.pushInteraction(
        'search',
        'search-bar',
        query,
        results.length
      );
    } catch (error) {
      console.error('Search failed:', error);
    }
  }

  private async performSearch(query: string): Promise<any[]> {
    // Your search logic here
    return [];
  }
}
```

## Authentication Component with GTM Tracking

```typescript
import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { GtmService } from '../../core/services/gtm.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, InputTextModule, PasswordModule, ButtonModule],
  template: `
    <div class="login-container p-4">
      <form (ngSubmit)="onLogin()" #loginForm="ngForm">
        <div class="mb-4">
          <label>Email</label>
          <input
            pInputText
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            email
          />
        </div>

        <div class="mb-4">
          <label>Password</label>
          <p-password
            [(ngModel)]="password"
            name="password"
            [feedback]="false"
            required
          ></p-password>
        </div>

        <p-button
          type="submit"
          label="Login"
          [disabled]="loginForm.invalid || isLoading()"
        ></p-button>

        @if (error()) {
          <p class="text-red-500 mt-2">{{ error() }}</p>
        }
      </form>
    </div>
  `
})
export class Login {
  private authService = inject(AuthService);
  private gtmService = inject(GtmService);
  private router = inject(Router);

  email = signal('');
  password = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);

  async onLogin(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    const loginStartTime = Date.now();

    try {
      const user = await this.authService.login(
        this.email(),
        this.password()
      );

      const loginDuration = Date.now() - loginStartTime;

      // Track successful login
      this.gtmService.pushEvent('login', {
        method: 'email',
        success: true,
        duration_ms: loginDuration
      });

      // Push user data to data layer (non-PII)
      this.gtmService.pushData({
        user_id: user.id,
        user_type: user.type,
        is_authenticated: true
      });

      this.gtmService.pushInteraction(
        'login',
        'authentication',
        'success'
      );

      // Navigate to home
      this.router.navigate(['/']);
    } catch (error) {
      this.error.set('Invalid credentials');

      // Track login failure
      this.gtmService.pushEvent('login', {
        method: 'email',
        success: false,
        error: 'invalid_credentials'
      });

      this.gtmService.pushInteraction(
        'login',
        'authentication',
        'failure'
      );
    } finally {
      this.isLoading.set(false);
    }
  }
}
```

## E-commerce Auction Component

```typescript
import { Component, signal, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { GtmService } from '../../core/services/gtm.service';

interface Auction {
  id: string;
  title: string;
  description: string;
  currentBid: number;
  category: string;
}

@Component({
  selector: 'app-auction-detail',
  imports: [ButtonModule, CardModule, InputNumberModule, FormsModule],
  template: `
    <div class="auction-detail p-4">
      @if (auction()) {
        <p-card>
          <h1>{{ auction()!.title }}</h1>
          <p>{{ auction()!.description }}</p>
          <p class="text-2xl font-bold">
            Current Bid: \${{ auction()!.currentBid }}
          </p>

          <div class="mt-4">
            <p-inputNumber
              [(ngModel)]="bidAmount"
              mode="currency"
              currency="USD"
              [min]="auction()!.currentBid + 1"
            ></p-inputNumber>

            <p-button
              label="Place Bid"
              (onClick)="onPlaceBid()"
              class="ml-2"
            ></p-button>
          </div>

          <div class="mt-4">
            <p-button
              label="Add to Watchlist"
              (onClick)="onAddToWatchlist()"
              severity="secondary"
              icon="pi pi-star"
            ></p-button>
          </div>
        </p-card>
      }
    </div>
  `
})
export class AuctionDetail implements OnInit {
  private gtmService = inject(GtmService);
  private route = inject(ActivatedRoute);

  auction = signal<Auction | null>(null);
  bidAmount = signal(0);
  viewStartTime = 0;

  ngOnInit(): void {
    this.viewStartTime = Date.now();
    this.loadAuction();
  }

  async loadAuction(): Promise<void> {
    const id = this.route.snapshot.params['id'];
    // Load auction data...
    const auction: Auction = {
      id,
      title: 'Example Auction',
      description: 'Description',
      currentBid: 100,
      category: 'electronics'
    };

    this.auction.set(auction);
    this.bidAmount.set(auction.currentBid + 1);

    // Track product view
    this.gtmService.pushEvent('view_item', {
      currency: 'USD',
      value: auction.currentBid,
      items: [{
        item_id: auction.id,
        item_name: auction.title,
        item_category: auction.category,
        price: auction.currentBid
      }]
    });
  }

  async onPlaceBid(): Promise<void> {
    const auction = this.auction();
    if (!auction) return;

    try {
      // Place bid logic...

      // Track bid placement
      this.gtmService.pushEvent('begin_checkout', {
        currency: 'USD',
        value: this.bidAmount(),
        items: [{
          item_id: auction.id,
          item_name: auction.title,
          item_category: auction.category,
          price: this.bidAmount()
        }]
      });

      this.gtmService.pushEvent('bid_placed', {
        auction_id: auction.id,
        auction_title: auction.title,
        bid_amount: this.bidAmount(),
        previous_bid: auction.currentBid
      });

      this.gtmService.pushInteraction(
        'click',
        'button',
        'place-bid',
        this.bidAmount()
      );
    } catch (error) {
      this.gtmService.pushEvent('bid_error', {
        auction_id: auction.id,
        error_type: 'placement_failed'
      });
    }
  }

  onAddToWatchlist(): void {
    const auction = this.auction();
    if (!auction) return;

    // Track add to wishlist
    this.gtmService.pushEvent('add_to_wishlist', {
      currency: 'USD',
      value: auction.currentBid,
      items: [{
        item_id: auction.id,
        item_name: auction.title,
        item_category: auction.category,
        price: auction.currentBid
      }]
    });

    this.gtmService.pushInteraction(
      'click',
      'button',
      'add-to-watchlist'
    );
  }

  ngOnDestroy(): void {
    // Track time spent viewing
    const timeSpent = Date.now() - this.viewStartTime;
    const auction = this.auction();

    if (auction) {
      this.gtmService.pushEvent('item_view_duration', {
        item_id: auction.id,
        duration_ms: timeSpent,
        duration_seconds: Math.round(timeSpent / 1000)
      });
    }
  }
}
```

## Service with GTM Tracking

```typescript
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { GtmService } from '../../core/services/gtm.service';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private http = inject(HttpClient);
  private gtmService = inject(GtmService);
  private apiUrl = '/api/auctions';

  getAuctions(): Observable<Auction[]> {
    const startTime = Date.now();

    return this.http.get<Auction[]>(this.apiUrl).pipe(
      tap(auctions => {
        const duration = Date.now() - startTime;

        // Track successful API call
        this.gtmService.pushEvent('api_call', {
          endpoint: '/api/auctions',
          method: 'GET',
          success: true,
          duration_ms: duration,
          result_count: auctions.length
        });
      }),
      catchError(error => {
        // Track API error
        this.gtmService.pushEvent('api_error', {
          endpoint: '/api/auctions',
          method: 'GET',
          error_code: error.status,
          error_message: error.message
        });

        throw error;
      })
    );
  }

  placeBid(auctionId: string, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${auctionId}/bids`, { amount }).pipe(
      tap(() => {
        this.gtmService.pushEvent('bid_success', {
          auction_id: auctionId,
          bid_amount: amount
        });
      }),
      catchError(error => {
        this.gtmService.pushEvent('bid_failed', {
          auction_id: auctionId,
          bid_amount: amount,
          error_code: error.status
        });

        throw error;
      })
    );
  }
}
```

## Guard with GTM Tracking

```typescript
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GtmService } from '../services/gtm.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const gtmService = inject(GtmService);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Track unauthorized access attempt
  gtmService.pushEvent('unauthorized_access', {
    attempted_url: state.url,
    redirect_to: '/login'
  });

  gtmService.pushInteraction(
    'redirect',
    'security',
    'unauthorized-access'
  );

  authService.setRedirectUrl(state.url);
  return router.createUrlTree(['/login']);
};
```

## Integration Checklist

When adding GTM tracking to a component:

- [ ] Inject `GtmService`
- [ ] Track user interactions (clicks, submissions)
- [ ] Track custom events relevant to your feature
- [ ] Include meaningful data with events
- [ ] Handle error scenarios
- [ ] Don't send PII (Personal Identifiable Information)
- [ ] Test events in GTM Preview mode
- [ ] Verify data layer in browser console

---

**Remember**: Always test your GTM implementation in GTM Preview mode before deploying to production!

