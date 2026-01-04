import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Profile } from './profile';
import { ProfileService } from './services/profile.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from './interfaces/profile.interface';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;
  let profileService: jasmine.SpyObj<ProfileService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUserProfile: UserProfile = {
    id: '1',
    firstName: 'خالد',
    lastName: 'أحمد',
    email: 'khaled@gmail.com',
    phoneNumber: '0000000000',
    phoneCountryCode: '+962',
    bidsCount: 65,
    favoritesCount: 10
  };

  beforeEach(async () => {
    const profileServiceSpy = jasmine.createSpyObj('ProfileService', [
      'getUserProfile'
    ]);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        Profile,
        HttpClientTestingModule,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'en'
          }
        })
      ],
      providers: [
        { provide: ProfileService, useValue: profileServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    profileService = TestBed.inject(ProfileService) as jasmine.SpyObj<ProfileService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    profileService.getUserProfile.and.returnValue(of(mockUserProfile));

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile on init', async () => {
    await component.ngOnInit();

    expect(profileService.getUserProfile).toHaveBeenCalled();
    expect(component.profile()).toEqual(mockUserProfile);
  });

  it('should load profile data correctly', async () => {
    await component.ngOnInit();

    const profile = component.profile();
    expect(profile).toBeTruthy();
    expect(profile?.firstName).toBe('خالد');
    expect(profile?.lastName).toBe('أحمد');
  });

  it('should navigate when menu item is clicked', () => {
    component.onMenuItemClick({ itemId: 'change-password', route: '/profile/change-password' });

    expect(component.activeMenuItem()).toBe('change-password');
    expect(router.navigate).toHaveBeenCalledWith(['/profile/change-password']);
  });

  it('should not navigate when menu item has no route', () => {
    component.onMenuItemClick({ itemId: 'personal-info' });

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should update active menu item on click', () => {
    expect(component.activeMenuItem()).toBe('personal-info');

    component.onMenuItemClick({ itemId: 'settings', route: '/profile/settings' });

    expect(component.activeMenuItem()).toBe('settings');
  });

  it('should sign out successfully', async () => {
    authService.logout.and.returnValue(Promise.resolve());

    await component.onSignOut();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should handle sign out error', async () => {
    authService.logout.and.returnValue(Promise.reject(new Error('Logout failed')));

    await component.onSignOut();

    expect(component.error()).toBe('profile.errors.signOutFailed');
  });

  it('should handle profile load error', async () => {
    profileService.getUserProfile.and.returnValue(
      throwError(() => new Error('Load failed'))
    );

    await component.ngOnInit();

    expect(component.error()).toBe('profile.errors.loadFailed');
    expect(component.isLoading()).toBe(false);
  });

  it('should show loading state while loading profile', async () => {
    expect(component.isLoading()).toBe(false);

    const loadPromise = component.loadProfile();
    expect(component.isLoading()).toBe(true);

    await loadPromise;
    expect(component.isLoading()).toBe(false);
  });

  it('should display account menu items', () => {
    const accountMenu = component.accountMenuItems();

    expect(accountMenu.items.length).toBe(3);
    expect(accountMenu.items[0].id).toBe('personal-info');
    expect(accountMenu.items[1].id).toBe('change-password');
    expect(accountMenu.items[2].id).toBe('settings');
  });

  it('should display preferences menu items', () => {
    const preferencesMenu = component.preferencesMenuItems();

    expect(preferencesMenu.items.length).toBe(3);
    expect(preferencesMenu.items[0].id).toBe('regions');
    expect(preferencesMenu.items[1].id).toBe('auctions');
    expect(preferencesMenu.items[2].id).toBe('favorites');
  });

  it('should clear error when loading profile', async () => {
    component.error.set('Previous error');

    await component.loadProfile();

    expect(component.error()).toBeNull();
  });

  it('should mark personal-info as active by default', () => {
    const accountMenu = component.accountMenuItems();

    expect(accountMenu.items[0].active).toBe(true);
    expect(accountMenu.items[1].active).toBe(false);
    expect(accountMenu.items[2].active).toBe(false);
  });

  it('should update active state when navigating to different section', () => {
    component.onMenuItemClick({ itemId: 'change-password', route: '/profile/change-password' });

    const accountMenu = component.accountMenuItems();
    expect(accountMenu.items[0].active).toBe(false);
    expect(accountMenu.items[1].active).toBe(true);
  });
});
