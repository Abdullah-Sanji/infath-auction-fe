import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

/**
 * Google Tag Manager Service
 * Handles GTM initialization and event tracking with SSR support
 */
@Injectable({
  providedIn: 'root',
})
export class GtmService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);
  private isInitialized = false;

  /**
   * Initialize Google Tag Manager
   * Only runs in browser environment
   */
  initialize(): void {
    if (!this.isBrowser || this.isInitialized) {
      return;
    }

    const gtmId = environment.gtm.id;

    if (!gtmId || gtmId === 'GTM-XXXXXXX') {
      console.warn('GTM: Container ID not configured. Skipping initialization.');
      return;
    }

    try {
      // Initialize dataLayer
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js',
      });

      // Inject GTM script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
      document.head.insertBefore(script, document.head.firstChild);

      this.isInitialized = true;
      console.log(`GTM: Initialized with container ID ${gtmId}`);
    } catch (error) {
      console.error('GTM: Failed to initialize', error);
    }
  }

  /**
   * Push a custom event to GTM dataLayer
   * @param event - Event name
   * @param data - Additional event data
   */
  pushEvent(event: string, data: Record<string, any> = {}): void {
    if (!this.isBrowser) {
      return;
    }

    if (!this.isInitialized) {
      console.warn('GTM: Cannot push event. GTM not initialized.');
      return;
    }

    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event,
        ...data,
      });
      console.log('GTM: Event pushed', { event, data });
    } catch (error) {
      console.error('GTM: Failed to push event', error);
    }
  }

  /**
   * Push page view event to GTM
   * @param url - Page URL
   * @param title - Page title
   */
  pushPageView(url: string, title: string): void {
    this.pushEvent('page_view', {
      page_path: url,
      page_title: title,
    });
  }

  /**
   * Push user interaction event to GTM
   * @param action - User action (e.g., 'click', 'submit')
   * @param category - Event category (e.g., 'button', 'form')
   * @param label - Event label
   * @param value - Optional numeric value
   */
  pushInteraction(action: string, category: string, label?: string, value?: number): void {
    this.pushEvent('user_interaction', {
      event_action: action,
      event_category: category,
      event_label: label,
      event_value: value,
    });
  }

  /**
   * Push custom data to dataLayer without triggering an event
   * @param data - Custom data to push
   */
  pushData(data: Record<string, any>): void {
    if (!this.isBrowser) {
      return;
    }

    if (!this.isInitialized) {
      console.warn('GTM: Cannot push data. GTM not initialized.');
      return;
    }

    try {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push(data);
      console.log('GTM: Data pushed', data);
    } catch (error) {
      console.error('GTM: Failed to push data', error);
    }
  }

  /**
   * Check if GTM is initialized
   */
  get initialized(): boolean {
    return this.isInitialized;
  }
}
