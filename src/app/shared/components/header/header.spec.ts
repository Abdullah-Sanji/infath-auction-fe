import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { provideZonelessChangeDetection } from '@angular/core';
import { Header } from './header';
import { AuthService } from '../../../core/services/auth.service';
import { UserProfile } from '@shared/models/auth.models';

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async () => {
    // Clear any existing cookies before each test
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideZonelessChangeDetection(),
        provideRouter([]),
        AuthService
      ]
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

  it('should display login button when user is not logged in', () => {
    // Ensure user is logged out
    authService.resetAuthState();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('.action-login');

    expect(loginButton).toBeTruthy();
    expect(loginButton.textContent).toContain('تسجيل الدخول');
  });

  it('should display menu button, user profile, and wallet when user is logged in', () => {
    // Mock authenticated state
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد',
      email: 'ahmed@example.com'
    };
    
    // Set user profile directly (bypassing auth flow)
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const menuButton = compiled.querySelector('.menu-button');
    const userProfile = compiled.querySelector('.user-profile');
    const walletDisplay = compiled.querySelector('.wallet-display');

    expect(menuButton).toBeTruthy();
    expect(userProfile).toBeTruthy();
    expect(walletDisplay).toBeTruthy();
  });

  it('should display user name when logged in', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد',
      email: 'ahmed@example.com'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const userName = compiled.querySelector('.user-name');

    expect(userName).toBeTruthy();
    expect(userName.textContent).toContain('أحمد خالد');
  });

  it('should display user avatar with initials', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد',
      email: 'ahmed@example.com'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const avatarInitials = compiled.querySelector('.avatar-initials');

    expect(avatarInitials).toBeTruthy();
    expect(avatarInitials.textContent).toBe('أخ');
  });

  it('should display wallet balance', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    component.walletBalance.set(10000);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const balance = compiled.querySelector('.balance');

    expect(balance).toBeTruthy();
    expect(balance.textContent).toContain('10000');
  });

  it('should display menu items when authenticated', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const menuItems = compiled.querySelectorAll('.menu-item');

    expect(menuItems.length).toBeGreaterThan(0);
  });

  it('should display logo', () => {
    const compiled = fixture.nativeElement;
    const logo = compiled.querySelector('.logo');
    const logoImg = compiled.querySelector('.logo-img');

    expect(logo).toBeTruthy();
    expect(logoImg).toBeTruthy();
    expect(logoImg.getAttribute('src')).toBe('images/icons/company-logo.svg');
  });

  it('should call login method when login button is clicked', () => {
    authService.resetAuthState();
    fixture.detectChanges();

    spyOn(component, 'login');
    spyOn(router, 'navigateByUrl');

    const compiled = fixture.nativeElement;
    const loginButton = compiled.querySelector('.action-login') as HTMLButtonElement;

    loginButton.click();

    expect(component.login).toHaveBeenCalled();
  });

  it('should call navigateToProfile when user profile is clicked', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    spyOn(component, 'navigateToProfile');
    spyOn(router, 'navigateByUrl');

    const compiled = fixture.nativeElement;
    const userProfile = compiled.querySelector('.user-profile') as HTMLElement;

    userProfile.click();

    expect(component.navigateToProfile).toHaveBeenCalled();
  });

  it('should call navigateToWallet when wallet is clicked', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'أحمد',
      lastName: 'خالد',
      fullName: 'أحمد خالد'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    (authService as any)._isAuthenticated.set(true);
    fixture.detectChanges();

    spyOn(component, 'navigateToWallet');
    spyOn(router, 'navigateByUrl');

    const compiled = fixture.nativeElement;
    const walletDisplay = compiled.querySelector('.wallet-display') as HTMLElement;

    walletDisplay.click();

    expect(component.navigateToWallet).toHaveBeenCalled();
  });

  it('should compute user initials correctly from firstName and lastName', () => {
    const mockProfile: UserProfile = {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      fullName: 'John Doe'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    fixture.detectChanges();

    expect(component.userInitials()).toBe('JD');
  });

  it('should compute user initials from fullName when firstName/lastName not available', () => {
    const mockProfile: UserProfile = {
      id: '1',
      fullName: 'أحمد خالد'
    };
    
    (authService as any)._userProfile.set(mockProfile);
    fixture.detectChanges();

    expect(component.userInitials().length).toBeGreaterThan(0);
  });

  it('should display bottom divider', () => {
    const compiled = fixture.nativeElement;
    const divider = compiled.querySelector('.bottom-divider');

    expect(divider).toBeTruthy();
  });

  it('should have correct header structure', () => {
    const compiled = fixture.nativeElement;
    const navHeader = compiled.querySelector('.nav-header');
    const headerContent = compiled.querySelector('.header-content');
    const actions = compiled.querySelector('.actions');
    const menuGrow = compiled.querySelector('.menu-grow');

    expect(navHeader).toBeTruthy();
    expect(headerContent).toBeTruthy();
    expect(actions).toBeTruthy();
    expect(menuGrow).toBeTruthy();
  });
});

