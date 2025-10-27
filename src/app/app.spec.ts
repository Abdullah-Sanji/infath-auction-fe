import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, NavigationEnd } from '@angular/router';
import { App } from './app';
import { GtmService } from './core/services/gtm.service';
import { Subject } from 'rxjs';

describe('App', () => {
  let gtmServiceMock: jasmine.SpyObj<GtmService>;
  let routerEventsSubject: Subject<any>;

  beforeEach(async () => {
    // Create mock GTM service
    gtmServiceMock = jasmine.createSpyObj('GtmService', [
      'initialize',
      'pushPageView'
    ]);

    // Create router events subject
    routerEventsSubject = new Subject();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        { provide: GtmService, useValue: gtmServiceMock }
      ]
    }).compileComponents();

    // Mock router events
    const router = TestBed.inject(provideRouter([]).ɵproviders[0] as any);
    if (router && router.events) {
      router.events = routerEventsSubject.asObservable();
    }
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have title signal', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app['title']()).toBe('auctions-fe');
  });

  it('should render header component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-header')).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render toast component', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('p-toast')).toBeTruthy();
  });

  it('should initialize GTM on ngOnInit', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.ngOnInit();

    expect(gtmServiceMock.initialize).toHaveBeenCalled();
  });

  it('should track page views on navigation', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.ngOnInit();

    // Emit navigation end event
    const navigationEndEvent = new NavigationEnd(
      1,
      '/test-url',
      '/test-url'
    );

    routerEventsSubject.next(navigationEndEvent);

    expect(gtmServiceMock.pushPageView).toHaveBeenCalledWith(
      '/test-url',
      jasmine.any(String)
    );
  });

  it('should not track non-navigation events', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.ngOnInit();

    // Reset spy
    gtmServiceMock.pushPageView.calls.reset();

    // Emit non-navigation event
    routerEventsSubject.next({ type: 'other-event' });

    expect(gtmServiceMock.pushPageView).not.toHaveBeenCalled();
  });
});
