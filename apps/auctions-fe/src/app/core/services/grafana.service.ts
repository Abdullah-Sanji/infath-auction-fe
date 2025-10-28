import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  initializeFaro,
  getWebInstrumentations,
  ConsoleInstrumentation,
  ErrorsInstrumentation,
  SessionInstrumentation,
  ViewInstrumentation,
  WebVitalsInstrumentation,
  type Faro,
} from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import {
  GrafanaConfig,
  GrafanaUserContext,
  GrafanaCustomEvent,
  GrafanaPerformanceMeasurement,
  GrafanaErrorContext,
} from './grafana.interface';

/**
 * Grafana Frontend Observability Service
 *
 * This service provides integration with Grafana Faro for:
 * - Error tracking and reporting
 * - Performance monitoring (Web Vitals)
 * - Custom event tracking
 * - User session tracking
 * - Network request monitoring
 * - Console log capture
 *
 * Usage:
 * 1. Configure Grafana settings in environment files
 * 2. Initialize via APP_INITIALIZER in app.config.ts
 * 3. Use methods to track custom events, errors, and performance metrics
 *
 * @example
 * ```typescript
 * // Track custom event
 * grafanaService.trackEvent({
 *   name: 'auction_bid_placed',
 *   attributes: { auctionId: '123', amount: 1000 }
 * });
 *
 * // Track error with context
 * grafanaService.trackError(error, {
 *   context: 'checkout',
 *   attributes: { step: 'payment' }
 * });
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class GrafanaService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private faro: Faro | null = null;

  // Track initialization state
  private initialized = signal(false);
  private config = signal<GrafanaConfig | null>(null);

  /**
   * Check if Grafana Faro is initialized and ready
   */
  isInitialized(): boolean {
    return this.initialized();
  }

  /**
   * Get current configuration
   */
  getConfig(): GrafanaConfig | null {
    return this.config();
  }

  /**
   * Initialize Grafana Faro with configuration
   * This should be called once during application bootstrap
   *
   * @param config - Grafana configuration from environment
   */
  initialize(config: GrafanaConfig): void {
    // Only initialize in browser environment
    if (!this.isBrowser) {
      console.warn('Grafana Faro: Cannot initialize in non-browser environment (SSR)');
      return;
    }

    // Check if already initialized
    if (this.initialized()) {
      console.warn('Grafana Faro: Already initialized');
      return;
    }

    // Check if enabled
    if (!config.enabled) {
      console.log('Grafana Faro: Disabled in configuration');
      return;
    }

    // Validate required configuration
    if (!config.url) {
      console.error('Grafana Faro: Missing collector URL in configuration');
      return;
    }

    try {
      // Build instrumentations array based on configuration
      const instrumentations = this.buildInstrumentations(config);

      // Initialize Faro
      this.faro = initializeFaro({
        url: config.url,
        app: {
          name: config.appName,
          version: config.appVersion,
          environment: config.environment,
        },
        sessionTracking: config.sessionTracking,
        instrumentations,
      });

      this.config.set(config);
      this.initialized.set(true);

      console.log('Grafana Faro: Successfully initialized', {
        app: config.appName,
        version: config.appVersion,
        environment: config.environment,
      });
    } catch (error) {
      console.error('Grafana Faro: Failed to initialize', error);
    }
  }

  /**
   * Build instrumentations array based on configuration
   */
  private buildInstrumentations(config: GrafanaConfig): Array<any> {
    const instrumentations: Array<any> = [];
    const inst = config.instrumentations;

    if (!inst) {
      // If no specific instrumentations config, use defaults
      return [...getWebInstrumentations(), new TracingInstrumentation()];
    }

    // Add instrumentations based on configuration
    if (inst.errors) {
      instrumentations.push(new ErrorsInstrumentation());
    }

    if (inst.console) {
      instrumentations.push(new ConsoleInstrumentation());
    }

    if (inst.webVitals) {
      instrumentations.push(new WebVitalsInstrumentation());
    }

    if (inst.interactions) {
      instrumentations.push(new ViewInstrumentation());
    }

    // Network instrumentation is included in getWebInstrumentations()
    // and doesn't need to be added separately

    if (config.sessionTracking?.enabled) {
      instrumentations.push(new SessionInstrumentation());
    }

    // Always add tracing
    instrumentations.push(new TracingInstrumentation());

    return instrumentations;
  }

  /**
   * Set user context for tracking
   * This associates all subsequent events with the user
   *
   * @param user - User context information
   */
  setUser(user: GrafanaUserContext): void {
    if (!this.isReady()) return;

    try {
      this.faro!.api.setUser({
        id: user.id,
        email: user.email,
        username: user.username,
        attributes: user.attributes,
      });

      console.log('Grafana Faro: User context set', { userId: user.id });
    } catch (error) {
      console.error('Grafana Faro: Failed to set user context', error);
    }
  }

  /**
   * Clear user context (e.g., on logout)
   */
  clearUser(): void {
    if (!this.isReady()) return;

    try {
      this.faro!.api.resetUser();
      console.log('Grafana Faro: User context cleared');
    } catch (error) {
      console.error('Grafana Faro: Failed to clear user context', error);
    }
  }

  /**
   * Track a custom event
   * Use this to track important application events
   *
   * @param event - Custom event with name and attributes
   */
  trackEvent(event: GrafanaCustomEvent): void {
    if (!this.isReady()) return;

    try {
      // Convert attributes to strings as required by Faro
      const stringAttributes: Record<string, string> = {};
      if (event.attributes) {
        Object.entries(event.attributes).forEach(([key, value]) => {
          stringAttributes[key] = String(value);
        });
      }

      this.faro!.api.pushEvent(event.name, stringAttributes, event.domain);

      console.log('Grafana Faro: Event tracked', { event: event.name });
    } catch (error) {
      console.error('Grafana Faro: Failed to track event', error);
    }
  }

  /**
   * Track an error with optional context
   * This supplements automatic error tracking
   *
   * @param error - The error object or message
   * @param context - Additional context information
   */
  trackError(error: Error | string, context?: GrafanaErrorContext): void {
    if (!this.isReady()) return;

    try {
      const errorObj = typeof error === 'string' ? new Error(error) : error;

      // Convert attributes to strings and merge with context
      const errorContext: Record<string, string> = {};
      if (context?.context) {
        errorContext['context'] = context.context;
      }
      if (context?.attributes) {
        Object.entries(context.attributes).forEach(([key, value]) => {
          errorContext[key] = String(value);
        });
      }

      this.faro!.api.pushError(errorObj, errorContext);

      console.log('Grafana Faro: Error tracked', {
        error: errorObj.message,
        context: context?.context,
      });
    } catch (err) {
      console.error('Grafana Faro: Failed to track error', err);
    }
  }

  /**
   * Track a custom performance measurement
   * Use this to track custom performance metrics
   *
   * @param measurement - Performance measurement with name and value
   */
  trackPerformance(measurement: GrafanaPerformanceMeasurement): void {
    if (!this.isReady()) return;

    try {
      // Convert attributes to strings as required by Faro
      const stringContext: Record<string, string> = {};
      if (measurement.attributes) {
        Object.entries(measurement.attributes).forEach(([key, value]) => {
          stringContext[key] = String(value);
        });
      }

      this.faro!.api.pushMeasurement({
        type: measurement.name,
        values: {
          value: measurement.value,
        },
        context: stringContext,
      });

      console.log('Grafana Faro: Performance tracked', {
        name: measurement.name,
        value: measurement.value,
      });
    } catch (error) {
      console.error('Grafana Faro: Failed to track performance', error);
    }
  }

  /**
   * Track page view manually
   * Normally handled automatically, but can be called for SPA navigation
   *
   * @param pageName - Name of the page/route
   * @param attributes - Additional attributes
   */
  trackPageView(pageName: string, attributes?: Record<string, string>): void {
    if (!this.isReady()) return;

    try {
      this.faro!.api.pushEvent(
        'page_view',
        {
          page: pageName,
          ...attributes,
        },
        'navigation'
      );

      console.log('Grafana Faro: Page view tracked', { page: pageName });
    } catch (error) {
      console.error('Grafana Faro: Failed to track page view', error);
    }
  }

  /**
   * Add global attributes that will be attached to all events
   *
   * @param attributes - Key-value pairs to attach to all events
   */
  setGlobalAttributes(attributes: Record<string, string>): void {
    if (!this.isReady()) return;

    try {
      Object.entries(attributes).forEach(([key, value]) => {
        this.faro!.api.setSession({
          attributes: {
            [key]: value,
          },
        });
      });

      console.log('Grafana Faro: Global attributes set', attributes);
    } catch (error) {
      console.error('Grafana Faro: Failed to set global attributes', error);
    }
  }

  /**
   * Pause data collection
   * Useful for privacy-sensitive operations
   */
  pause(): void {
    if (!this.isReady()) return;

    try {
      this.faro!.pause();
      console.log('Grafana Faro: Data collection paused');
    } catch (error) {
      console.error('Grafana Faro: Failed to pause', error);
    }
  }

  /**
   * Resume data collection after pausing
   */
  unpause(): void {
    if (!this.isReady()) return;

    try {
      this.faro!.unpause();
      console.log('Grafana Faro: Data collection resumed');
    } catch (error) {
      console.error('Grafana Faro: Failed to resume', error);
    }
  }

  /**
   * Check if Faro is ready to use
   */
  private isReady(): boolean {
    if (!this.isBrowser) {
      console.warn('Grafana Faro: Not available in non-browser environment');
      return false;
    }

    if (!this.initialized() || !this.faro) {
      console.warn('Grafana Faro: Not initialized. Call initialize() first.');
      return false;
    }

    return true;
  }

  /**
   * Get the underlying Faro instance
   * Use with caution - prefer using the service methods
   */
  getFaroInstance(): Faro | null {
    return this.faro;
  }
}
