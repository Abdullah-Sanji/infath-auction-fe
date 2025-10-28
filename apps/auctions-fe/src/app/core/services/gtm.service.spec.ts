import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { GtmService } from './gtm.service';

describe('GtmService', () => {
  let service: GtmService;
  let mockWindow: any;

  beforeEach(() => {
    // Mock window and dataLayer
    mockWindow = {
      dataLayer: [],
    };
    (global as any).window = mockWindow;

    TestBed.configureTestingModule({
      providers: [GtmService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(GtmService);
  });

  afterEach(() => {
    // Clean up
    delete (global as any).window;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not initialize on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [GtmService, { provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverService = TestBed.inject(GtmService);
    serverService.initialize();

    expect(serverService.initialized).toBe(false);
  });

  it('should initialize GTM in browser', () => {
    const originalEnv = require('../../../environments/environment').environment;
    const mockEnv = { ...originalEnv, gtm: { id: 'GTM-TEST123' } };

    // Mock environment
    jest
      .spyOn(require('../../../environments/environment'), 'environment', 'get')
      .mockReturnValue(mockEnv);

    // Mock document
    const mockScript = { async: false, src: '' };
    const mockHead = {
      firstChild: {},
      insertBefore: jest.fn(),
    };
    (global as any).document = {
      createElement: jest.fn().mockReturnValue(mockScript),
      head: mockHead,
    };

    service.initialize();

    expect(service.initialized).toBe(true);
    expect(mockWindow.dataLayer.length).toBeGreaterThan(0);
    expect(mockHead.insertBefore).toHaveBeenCalled();
  });

  it('should not initialize twice', () => {
    const mockEnv = { gtm: { id: 'GTM-TEST123' } };
    jest
      .spyOn(require('../../../environments/environment'), 'environment', 'get')
      .mockReturnValue(mockEnv);

    const mockHead = {
      firstChild: {},
      insertBefore: jest.fn(),
    };
    (global as any).document = {
      createElement: jest.fn().mockReturnValue({ async: false, src: '' }),
      head: mockHead,
    };

    service.initialize();
    service.initialize();

    expect(mockHead.insertBefore).toHaveBeenCalledTimes(1);
  });

  it('should skip initialization with invalid GTM ID', () => {
    const mockEnv = { gtm: { id: 'GTM-XXXXXXX' } };
    jest
      .spyOn(require('../../../environments/environment'), 'environment', 'get')
      .mockReturnValue(mockEnv);

    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    service.initialize();

    expect(service.initialized).toBe(false);
    expect(consoleWarnSpy).toHaveBeenCalled();

    consoleWarnSpy.mockRestore();
  });

  it('should push custom event to dataLayer', () => {
    // Initialize first
    (service as any).isInitialized = true;

    service.pushEvent('test_event', { key: 'value' });

    expect(mockWindow.dataLayer).toContainEqual({
      event: 'test_event',
      key: 'value',
    });
  });

  it('should push page view event', () => {
    (service as any).isInitialized = true;

    service.pushPageView('/test-page', 'Test Page');

    expect(mockWindow.dataLayer).toContainEqual({
      event: 'page_view',
      page_path: '/test-page',
      page_title: 'Test Page',
    });
  });

  it('should push user interaction event', () => {
    (service as any).isInitialized = true;

    service.pushInteraction('click', 'button', 'submit-btn', 1);

    expect(mockWindow.dataLayer).toContainEqual({
      event: 'user_interaction',
      event_action: 'click',
      event_category: 'button',
      event_label: 'submit-btn',
      event_value: 1,
    });
  });

  it('should push custom data to dataLayer', () => {
    (service as any).isInitialized = true;

    const customData = { userId: '123', userType: 'premium' };
    service.pushData(customData);

    expect(mockWindow.dataLayer).toContainEqual(customData);
  });

  it('should not push events if not initialized', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    service.pushEvent('test_event');

    expect(consoleWarnSpy).toHaveBeenCalledWith('GTM: Cannot push event. GTM not initialized.');

    consoleWarnSpy.mockRestore();
  });

  it('should not push data if not initialized', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    service.pushData({ key: 'value' });

    expect(consoleWarnSpy).toHaveBeenCalledWith('GTM: Cannot push data. GTM not initialized.');

    consoleWarnSpy.mockRestore();
  });

  it('should handle errors during initialization', () => {
    const mockEnv = { gtm: { id: 'GTM-TEST123' } };
    jest
      .spyOn(require('../../../environments/environment'), 'environment', 'get')
      .mockReturnValue(mockEnv);

    // Mock document to throw error
    (global as any).document = {
      createElement: jest.fn().mockImplementation(() => {
        throw new Error('Script creation failed');
      }),
    };

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    service.initialize();

    expect(service.initialized).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle errors when pushing events', () => {
    (service as any).isInitialized = true;

    // Make dataLayer throw error
    Object.defineProperty(mockWindow, 'dataLayer', {
      get: () => {
        throw new Error('DataLayer error');
      },
    });

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    service.pushEvent('test_event');

    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should not push events on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [GtmService, { provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverService = TestBed.inject(GtmService);
    const initialLength = mockWindow.dataLayer.length;

    serverService.pushEvent('test_event');

    expect(mockWindow.dataLayer.length).toBe(initialLength);
  });

  it('should not push data on server platform', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [GtmService, { provide: PLATFORM_ID, useValue: 'server' }],
    });

    const serverService = TestBed.inject(GtmService);
    const initialLength = mockWindow.dataLayer.length;

    serverService.pushData({ key: 'value' });

    expect(mockWindow.dataLayer.length).toBe(initialLength);
  });
});
