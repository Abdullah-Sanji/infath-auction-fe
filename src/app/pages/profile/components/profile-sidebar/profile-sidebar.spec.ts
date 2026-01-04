import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ProfileSidebar } from './profile-sidebar';
import { UserProfile, ProfileMenuSection } from '../../interfaces/profile.interface';

describe('ProfileSidebar', () => {
  let component: ProfileSidebar;
  let fixture: ComponentFixture<ProfileSidebar>;

  const mockProfile: UserProfile = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '123456789',
    phoneCountryCode: '+962',
    avatarUrl: 'https://example.com/avatar.jpg',
    bidsCount: 5,
    favoritesCount: 3
  };

  const mockAccountMenuItems: ProfileMenuSection = {
    title: 'profile.menu.account',
    items: [
      {
        id: 'personal-info',
        title: 'profile.menu.personalInfo',
        description: 'profile.menu.personalInfoDesc',
        icon: 'pi pi-user',
        route: '/profile/personal-info',
        active: true
      }
    ]
  };

  const mockPreferencesMenuItems: ProfileMenuSection = {
    title: 'profile.menu.preferences',
    items: [
      {
        id: 'favorites',
        title: 'profile.menu.favorites',
        description: 'profile.menu.favoritesDesc',
        icon: 'pi pi-heart',
        route: '/profile/favorites',
        active: false
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileSidebar,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'en'
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileSidebar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('profile', mockProfile);
    fixture.componentRef.setInput('accountMenuItems', mockAccountMenuItems);
    fixture.componentRef.setInput('preferencesMenuItems', mockPreferencesMenuItems);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute user initials correctly', () => {
    expect(component.userInitials()).toBe('JD');
  });

  it('should compute full name correctly', () => {
    expect(component.fullName()).toBe('John Doe');
  });

  it('should emit menu item click event', () => {
    spyOn(component.onMenuItemClick, 'emit');
    
    component.handleMenuItemClick({ itemId: 'test', route: '/test' });
    
    expect(component.onMenuItemClick.emit).toHaveBeenCalledWith({
      itemId: 'test',
      route: '/test'
    });
  });

  it('should emit sign out event', () => {
    spyOn(component.onSignOut, 'emit');
    
    component.handleSignOut();
    
    expect(component.onSignOut.emit).toHaveBeenCalled();
  });

  it('should display user profile information', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('John Doe');
  });

  it('should display stats', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('5'); // bidsCount
    expect(compiled.textContent).toContain('3'); // favoritesCount
  });
});

