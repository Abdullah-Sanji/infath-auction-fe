import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { Login } from './login';
import { AuthService } from '../../core/services/auth.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'getRedirectUrl']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        Login,
        HttpClientTestingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        PasswordModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty credentials and no errors', () => {
    expect(component.username()).toBe('');
    expect(component.password()).toBe('');
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should successfully login with valid credentials', async () => {
    authService.login.and.returnValue(Promise.resolve(true));
    authService.getRedirectUrl.and.returnValue('/home');
    router.navigate.and.returnValue(Promise.resolve(true));

    component.username.set('testuser');
    component.password.set('password123');

    await component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('testuser', 'password123');
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage()).toBe('');
    expect(component.isLoading()).toBe(false);
  });

  it('should display error message on failed login', async () => {
    authService.login.and.returnValue(Promise.resolve(false));

    component.username.set('wronguser');
    component.password.set('wrongpassword');

    await component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith('wronguser', 'wrongpassword');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.errorMessage()).toContain('Invalid username or password');
    expect(component.isLoading()).toBe(false);
  });

  it('should handle login service exception', async () => {
    authService.login.and.returnValue(Promise.reject(new Error('Network error')));

    component.username.set('testuser');
    component.password.set('password123');

    await component.onSubmit();

    expect(component.errorMessage()).toContain('Unable to connect');
    expect(router.navigate).not.toHaveBeenCalled();
    expect(component.isLoading()).toBe(false);
  });

  it('should set loading state during login', async () => {
    authService.login.and.returnValue(
      new Promise((resolve) => setTimeout(() => resolve(true), 100))
    );
    authService.getRedirectUrl.and.returnValue('/');
    router.navigate.and.returnValue(Promise.resolve(true));

    component.username.set('testuser');
    component.password.set('password123');

    const submitPromise = component.onSubmit();

    // Should be loading immediately after submit
    expect(component.isLoading()).toBe(true);

    await submitPromise;

    // Should not be loading after completion
    expect(component.isLoading()).toBe(false);
  });

  it('should clear error message on new submit', async () => {
    authService.login.and.returnValue(Promise.resolve(false));

    component.username.set('testuser');
    component.password.set('password123');

    await component.onSubmit();
    expect(component.errorMessage()).toBeTruthy();

    // Submit again
    authService.login.and.returnValue(Promise.resolve(true));
    authService.getRedirectUrl.and.returnValue('/');
    router.navigate.and.returnValue(Promise.resolve(true));

    await component.onSubmit();

    expect(component.errorMessage()).toBe('');
  });

  it('should redirect to correct URL after successful login', async () => {
    authService.login.and.returnValue(Promise.resolve(true));
    authService.getRedirectUrl.and.returnValue('/auctions');
    router.navigate.and.returnValue(Promise.resolve(true));

    component.username.set('testuser');
    component.password.set('password123');

    await component.onSubmit();

    expect(authService.getRedirectUrl).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auctions']);
  });
});
