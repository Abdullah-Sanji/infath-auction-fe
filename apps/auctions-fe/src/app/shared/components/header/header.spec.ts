import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { Header } from './header';
import { AuthService } from '../../../core/services/auth.service';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    // Clear any existing cookies before each test
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [provideZonelessChangeDetection(), provideRouter([]), AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display navigation links', () => {
    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('.nav-links a');

    expect(links.length).toBeGreaterThan(0);
    expect(compiled.textContent).toContain('Home');
    expect(compiled.textContent).toContain('Auctions');
    expect(compiled.textContent).toContain('About');
  });

  it('should display logo', () => {
    const compiled = fixture.nativeElement;
    const logo = compiled.querySelector('.logo-text');

    expect(logo).toBeTruthy();
    expect(logo.textContent).toContain('Auctions');
  });

  it('should display login link when user is not logged in', () => {
    // Ensure user is logged out
    if (authService.isAuthenticated()) {
      authService.logout();
    }
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loginLink = compiled.querySelector('.login-link');

    expect(loginLink).toBeTruthy();
    if (loginLink) {
      expect(loginLink.textContent).toContain('Login');
    }
  });

  it('should display user name and logout button when user is logged in', () => {
    authService.login('john@example.com', 'password123');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const userName = compiled.querySelector('.user-name');
    const logoutButton = compiled.querySelector('.logout-button');

    expect(userName).toBeTruthy();
    expect(userName.textContent).toContain('john');
    expect(logoutButton).toBeTruthy();
    expect(logoutButton.textContent).toContain('Logout');
  });

  it('should not display login link when user is logged in', () => {
    authService.login('john@example.com', 'password123');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loginLink = compiled.querySelector('.login-link');

    expect(loginLink).toBeFalsy();
  });

  it('should call authService.logout when logout button is clicked', () => {
    authService.login('john@example.com', 'password123');
    fixture.detectChanges();

    spyOn(authService, 'logout').and.callThrough();

    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('.logout-button') as HTMLButtonElement;

    logoutButton.click();

    expect(authService.logout).toHaveBeenCalled();
  });

  it('should call logout method when logout button is clicked', () => {
    authService.login('john@example.com', 'password123');
    fixture.detectChanges();

    spyOn(component, 'logout');

    const compiled = fixture.nativeElement;
    const logoutButton = compiled.querySelector('.logout-button') as HTMLButtonElement;

    logoutButton.click();

    expect(component.logout).toHaveBeenCalled();
  });

  it('should have correct navigation structure', () => {
    const compiled = fixture.nativeElement;
    const navbar = compiled.querySelector('.navbar');
    const navContainer = compiled.querySelector('.nav-container');
    const navLinks = compiled.querySelector('.nav-links');

    expect(navbar).toBeTruthy();
    expect(navContainer).toBeTruthy();
    expect(navLinks).toBeTruthy();
  });

  it('should have sticky positioning on navbar', () => {
    const compiled = fixture.nativeElement;
    const navbar = compiled.querySelector('.navbar') as HTMLElement;
    const styles = window.getComputedStyle(navbar);

    expect(styles.position).toBe('sticky');
  });

  it('should have auth service injected', () => {
    expect(component['authService']).toBeTruthy();
  });

  it('should toggle between logged in and logged out states', () => {
    // Initial state - not logged in
    expect(authService.isLoggedIn()).toBe(false);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.login-link')).toBeTruthy();

    // Login
    authService.login('test@example.com', 'password');
    fixture.detectChanges();
    expect(authService.isLoggedIn()).toBe(true);
    expect(fixture.nativeElement.querySelector('.logout-button')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.login-link')).toBeFalsy();
  });
});
