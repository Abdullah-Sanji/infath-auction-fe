import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { GrafanaService } from './grafana.service';
import {
  GrafanaConfig,
  GrafanaUserContext,
  GrafanaCustomEvent,
  GrafanaPerformanceMeasurement,
  GrafanaErrorContext
} from './grafana.interface';

describe('GrafanaService', () => {
  let service: GrafanaService;
  let mockFaro: any;

  const mockConfig: GrafanaConfig = {
    enabled: true,
    url: 'http://localhost:4000/collect',
    appName: 'test-app',
    appVersion: '1.0.0',
    environment: 'test',
    sessionTracking: {
      enabled: true,
      persistent: true
    },
    instrumentations: {
      errors: true,
      console: true,
      webVitals: true,
      interactions: true,
      network: true
    }
  };

  beforeEach(() => {
    // Create mock Faro instance
    mockFaro = {
      api: {
        setUser: jasmine.createSpy('setUser'),
        resetUser: jasmine.createSpy('resetUser'),
        pushEvent: jasmine.createSpy('pushEvent'),
        pushError: jasmine.createSpy('pushError'),
        pushMeasurement: jasmine.createSpy('pushMeasurement'),
        setSession: jasmine.createSpy('setSession')
      },
      pause: jasmine.createSpy('pause'),
      unpause: jasmine.createSpy('unpause')
    };

    TestBed.configureTestingModule({
      providers: [
        GrafanaService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });

    service = TestBed.inject(GrafanaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('initialization', () => {
    it('should not be initialized by default', () => {
      expect(service.isInitialized()).toBe(false);
    });

    it('should not initialize when disabled in config', () => {
      const disabledConfig: GrafanaConfig = {
        ...mockConfig,
        enabled: false
      };

      service.initialize(disabledConfig);

      expect(service.isInitialized()).toBe(false);
    });

    it('should not initialize without collector URL', () => {
      const invalidConfig: GrafanaConfig = {
        ...mockConfig,
        url: ''
      };

      service.initialize(invalidConfig);

      expect(service.isInitialized()).toBe(false);
    });

    it('should store config after successful initialization', () => {
      // Mock successful initialization
      spyOn<any>(service, 'buildInstrumentations').and.returnValue([]);

      service.initialize(mockConfig);

      const storedConfig = service.getConfig();
      expect(storedConfig).toBeTruthy();
      expect(storedConfig?.appName).toBe('test-app');
    });
  });

  describe('user tracking', () => {
    beforeEach(() => {
      // Mock initialized state
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should set user context', () => {
      const user: GrafanaUserContext = {
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        attributes: {
          role: 'admin'
        }
      };

      service.setUser(user);

      expect(mockFaro.api.setUser).toHaveBeenCalledWith({
        id: 'user-123',
        email: 'test@example.com',
        username: 'testuser',
        attributes: {
          role: 'admin'
        }
      });
    });

    it('should clear user context', () => {
      service.clearUser();

      expect(mockFaro.api.resetUser).toHaveBeenCalled();
    });

    it('should not set user when not initialized', () => {
      service['initialized'].set(false);

      const user: GrafanaUserContext = {
        id: 'user-123'
      };

      service.setUser(user);

      expect(mockFaro.api.setUser).not.toHaveBeenCalled();
    });
  });

  describe('event tracking', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should track custom event', () => {
      const event: GrafanaCustomEvent = {
        name: 'auction_bid',
        attributes: {
          auctionId: '123',
          amount: 1000
        },
        domain: 'auctions'
      };

      service.trackEvent(event);

      expect(mockFaro.api.pushEvent).toHaveBeenCalledWith(
        'auction_bid',
        {
          auctionId: '123',
          amount: 1000
        },
        'auctions'
      );
    });

    it('should track event without domain', () => {
      const event: GrafanaCustomEvent = {
        name: 'button_click',
        attributes: {
          buttonId: 'submit'
        }
      };

      service.trackEvent(event);

      expect(mockFaro.api.pushEvent).toHaveBeenCalledWith(
        'button_click',
        {
          buttonId: 'submit'
        },
        undefined
      );
    });

    it('should not track event when not initialized', () => {
      service['initialized'].set(false);

      const event: GrafanaCustomEvent = {
        name: 'test_event'
      };

      service.trackEvent(event);

      expect(mockFaro.api.pushEvent).not.toHaveBeenCalled();
    });
  });

  describe('error tracking', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should track error with Error object', () => {
      const error = new Error('Test error');
      const context: GrafanaErrorContext = {
        context: 'checkout',
        attributes: {
          step: 'payment'
        }
      };

      service.trackError(error, context);

      expect(mockFaro.api.pushError).toHaveBeenCalledWith(
        error,
        jasmine.objectContaining({
          context: 'checkout',
          step: 'payment'
        })
      );
    });

    it('should track error with string message', () => {
      service.trackError('String error message');

      expect(mockFaro.api.pushError).toHaveBeenCalledWith(
        jasmine.any(Error),
        jasmine.any(Object)
      );
    });

    it('should track error without context', () => {
      const error = new Error('Test error');

      service.trackError(error);

      expect(mockFaro.api.pushError).toHaveBeenCalled();
    });

    it('should not track error when not initialized', () => {
      service['initialized'].set(false);

      service.trackError(new Error('Test'));

      expect(mockFaro.api.pushError).not.toHaveBeenCalled();
    });
  });

  describe('performance tracking', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should track performance measurement', () => {
      const measurement: GrafanaPerformanceMeasurement = {
        name: 'api_call_duration',
        value: 250,
        attributes: {
          endpoint: '/api/auctions',
          method: 'GET'
        }
      };

      service.trackPerformance(measurement);

      expect(mockFaro.api.pushMeasurement).toHaveBeenCalledWith({
        type: 'api_call_duration',
        values: {
          value: 250
        },
        context: {
          endpoint: '/api/auctions',
          method: 'GET'
        }
      });
    });

    it('should track performance without attributes', () => {
      const measurement: GrafanaPerformanceMeasurement = {
        name: 'page_load',
        value: 1500
      };

      service.trackPerformance(measurement);

      expect(mockFaro.api.pushMeasurement).toHaveBeenCalled();
    });

    it('should not track performance when not initialized', () => {
      service['initialized'].set(false);

      const measurement: GrafanaPerformanceMeasurement = {
        name: 'test',
        value: 100
      };

      service.trackPerformance(measurement);

      expect(mockFaro.api.pushMeasurement).not.toHaveBeenCalled();
    });
  });

  describe('page view tracking', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should track page view', () => {
      service.trackPageView('/auctions');

      expect(mockFaro.api.pushEvent).toHaveBeenCalledWith(
        'page_view',
        {
          page: '/auctions'
        },
        'navigation'
      );
    });

    it('should track page view with attributes', () => {
      service.trackPageView('/auctions', {
        category: 'electronics'
      });

      expect(mockFaro.api.pushEvent).toHaveBeenCalledWith(
        'page_view',
        {
          page: '/auctions',
          category: 'electronics'
        },
        'navigation'
      );
    });
  });

  describe('global attributes', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should set global attributes', () => {
      const attributes = {
        tenant: 'acme-corp',
        version: '1.0.0'
      };

      service.setGlobalAttributes(attributes);

      expect(mockFaro.api.setSession).toHaveBeenCalledTimes(2);
    });

    it('should not set global attributes when not initialized', () => {
      service['initialized'].set(false);

      service.setGlobalAttributes({ key: 'value' });

      expect(mockFaro.api.setSession).not.toHaveBeenCalled();
    });
  });

  describe('pause and unpause', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should pause data collection', () => {
      service.pause();

      expect(mockFaro.pause).toHaveBeenCalled();
    });

    it('should unpause data collection', () => {
      service.unpause();

      expect(mockFaro.unpause).toHaveBeenCalled();
    });

    it('should not pause when not initialized', () => {
      service['initialized'].set(false);

      service.pause();

      expect(mockFaro.pause).not.toHaveBeenCalled();
    });
  });

  describe('SSR compatibility', () => {
    it('should not initialize in server environment', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GrafanaService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      const serverService = TestBed.inject(GrafanaService);
      serverService.initialize(mockConfig);

      expect(serverService.isInitialized()).toBe(false);
    });

    it('should not track events in server environment', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [
          GrafanaService,
          { provide: PLATFORM_ID, useValue: 'server' }
        ]
      });

      const serverService = TestBed.inject(GrafanaService);
      serverService['initialized'].set(true);
      serverService['faro'] = mockFaro;

      const event: GrafanaCustomEvent = {
        name: 'test'
      };

      serverService.trackEvent(event);

      expect(mockFaro.api.pushEvent).not.toHaveBeenCalled();
    });
  });

  describe('getFaroInstance', () => {
    it('should return null when not initialized', () => {
      expect(service.getFaroInstance()).toBeNull();
    });

    it('should return Faro instance when initialized', () => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;

      expect(service.getFaroInstance()).toBe(mockFaro);
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      service['initialized'].set(true);
      service['faro'] = mockFaro;
    });

    it('should handle errors when tracking event fails', () => {
      mockFaro.api.pushEvent.and.throwError('Network error');

      expect(() => {
        service.trackEvent({ name: 'test' });
      }).not.toThrow();
    });

    it('should handle errors when setting user fails', () => {
      mockFaro.api.setUser.and.throwError('Invalid user');

      expect(() => {
        service.setUser({ id: 'test' });
      }).not.toThrow();
    });

    it('should handle errors when tracking error fails', () => {
      mockFaro.api.pushError.and.throwError('Push failed');

      expect(() => {
        service.trackError(new Error('Test'));
      }).not.toThrow();
    });
  });
});

