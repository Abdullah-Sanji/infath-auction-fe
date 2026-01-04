import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

// PrimeNG Imports
import { CardModule } from 'primeng/card';

// Components
import { ProfileSidebar } from './components/profile-sidebar/profile-sidebar';

// Services
import { ProfileService } from './services/profile.service';
import { AuthService } from '../../core/services/auth.service';

// Interfaces
import { UserProfile, ProfileMenuSection as ProfileMenuSectionType } from './interfaces/profile.interface';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    TranslocoModule,
    CardModule,
    RouterOutlet,
    ProfileSidebar
  ],
  providers: [ProfileService],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private authService = inject(AuthService);
  private router = inject(Router);

  // State
  profile = signal<UserProfile | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);


  // Active menu item tracking
  activeMenuItem = signal('personal-info');

  // Menu sections
  accountMenuItems = computed<ProfileMenuSectionType>(() => ({
    title: 'profile.menu.account',
    items: [
      {
        id: 'personal-info',
        title: 'profile.menu.personalInfo',
        description: 'profile.menu.personalInfoDesc',
        icon: 'pi pi-user',
        route: '/profile/personal-info',
        active: this.activeMenuItem() === 'personal-info'
      },
      {
        id: 'change-password',
        title: 'profile.menu.changePassword',
        description: 'profile.menu.changePasswordDesc',
        icon: 'pi pi-lock',
        route: '/profile/change-password',
        active: this.activeMenuItem() === 'change-password'
      },
      {
        id: 'settings',
        title: 'profile.menu.settings',
        description: 'profile.menu.settingsDesc',
        icon: 'pi pi-cog',
        route: '/profile/settings',
        active: this.activeMenuItem() === 'settings'
      }
    ]
  }));

  preferencesMenuItems = computed<ProfileMenuSectionType>(() => ({
    title: 'profile.menu.preferences',
    items: [
      {
        id: 'regions',
        title: 'profile.menu.regions',
        description: 'profile.menu.regionsDesc',
        icon: 'pi pi-map-marker',
        route: '/profile/regions',
        active: this.activeMenuItem() === 'regions'
      },
      {
        id: 'auctions',
        title: 'profile.menu.auctions',
        description: 'profile.menu.auctionsDesc',
        icon: 'pi pi-building',
        route: '/profile/auction-preferences',
        active: this.activeMenuItem() === 'auctions'
      },
      {
        id: 'favorites',
        title: 'profile.menu.favorites',
        description: 'profile.menu.favoritesDesc',
        icon: 'pi pi-heart',
        route: '/profile/favorites',
        active: this.activeMenuItem() === 'favorites'
      }
    ]
  }));

  async ngOnInit(): Promise<void> {
    await this.loadProfile();
  }

  async loadProfile(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Mock API response data for sidebar
      const mockProfile: UserProfile = {
        id: '1',
        firstName: 'أحمد',
        lastName: 'محمد',
        email: 'ahmed.mohammed@example.com',
        phoneNumber: '791234567',
        phoneCountryCode: '+962',
        avatarUrl: 'https://via.placeholder.com/150',
        bidsCount: 12,
        favoritesCount: 5
      };

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Uncomment below when ready to use real API:
      // const profile = await firstValueFrom(this.profileService.getUserProfile());
      // this.profile.set(profile);

      this.profile.set(mockProfile);
    } catch (error) {
      console.error('Failed to load profile:', error);
      this.error.set('profile.errors.loadFailed');
    } finally {
      this.isLoading.set(false);
    }
  }

  onMenuItemClick(event: { itemId: string; route?: string }): void {
    if (event.route) {
      this.activeMenuItem.set(event.itemId);
      this.router.navigate([event.route]);
    }
  }

  async onSignOut(): Promise<void> {
    try {
      await this.authService.logout();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Failed to sign out:', error);
      this.error.set('profile.errors.signOutFailed');
    }
  }
}
