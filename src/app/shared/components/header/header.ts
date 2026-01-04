import { Component, inject, signal, computed, HostListener, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

interface MenuSubItem {
  label: string;
  route: string[];
  ariaLabel: string;
}

interface MenuItem {
  label: string;
  route: string[];
  ariaLabel: string;
  showWhenAuthenticated: boolean;
  children?: MenuSubItem[];
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected authService = inject(AuthService);
  protected languageService = inject(LanguageService);
  protected router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  protected walletBalance = signal<number>(10000);
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly userProfile = this.authService.userProfile;
  protected openDropdown = signal<string | null>(null);

  // Scroll detection signals
  private lastScrollY = signal<number>(0);
  protected isHeaderVisible = signal<boolean>(true);

  protected readonly menuItems = computed<MenuItem[]>(() => {
    const isAuth = this.isAuthenticated();
    const items: MenuItem[] = [
      // LOGGED IN USER ITEMS
      {
        label: 'nav.home',
        route: ['/'],
        ariaLabel: 'nav.home',
        showWhenAuthenticated: true,
        children: [
          {
            label: 'nav.homeSubItem1',
            route: ['/home/subitem1'],
            ariaLabel: 'nav.homeSubItem1',
          },
          {
            label: 'nav.homeSubItem2',
            route: ['/home/subitem2'],
            ariaLabel: 'nav.homeSubItem2',
          },
        ],
      },
      {
        label: 'nav.myAuctions',
        route: ['/auctions'],
        ariaLabel: 'nav.myAuctions',
        showWhenAuthenticated: true,
      },
      {
        label: 'nav.myChats',
        route: ['/chats'],
        ariaLabel: 'nav.myChats',
        showWhenAuthenticated: true,
      },
      {
        label: 'nav.myOrders',
        route: ['/orders'],
        ariaLabel: 'nav.myOrders',
        showWhenAuthenticated: true,
      },
      // PUBLIC USER ITEMS
      {
        label: 'nav.browseAuctions',
        route: ['/'],
        ariaLabel: 'nav.browseAuctions',
        showWhenAuthenticated: false,
        children: [
          {
            label: 'nav.homeSubItem1',
            route: ['/home/subitem1'],
            ariaLabel: 'nav.homeSubItem1',
          },
          {
            label: 'nav.homeSubItem2',
            route: ['/home/subitem2'],
            ariaLabel: 'nav.homeSubItem2',
          },
        ],
      },
      {
        label: 'nav.auctionsCompanies',
        route: ['/'],
        ariaLabel: 'nav.auctionsCompanies',
        showWhenAuthenticated: false,
        children: [
          {
            label: 'nav.homeSubItem1',
            route: ['/home/subitem1'],
            ariaLabel: 'nav.homeSubItem1',
          },
          {
            label: 'nav.homeSubItem2',
            route: ['/home/subitem2'],
            ariaLabel: 'nav.homeSubItem2',
          },
        ],
      },
    ];
    return items.filter((item) => {
      return isAuth ? item.showWhenAuthenticated : !item.showWhenAuthenticated;
    });
  });

  protected readonly userInitials = computed(() => {
    const profile = this.userProfile();
    if (!profile) return 'AK';

    if (profile.firstName && profile.lastName) {
      return `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();
    }

    if (profile.fullName) {
      const parts = profile.fullName.split(' ');
      if (parts.length >= 2) {
        return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
      }
      return profile.fullName.substring(0, 2).toUpperCase();
    }

    if (profile.username) {
      return profile.username.substring(0, 2).toUpperCase();
    }

    return 'U';
  });

  protected readonly displayName = computed(() => {
    const profile = this.userProfile();
    return profile?.fullName || profile?.firstName || profile?.username || 'أحمد خالد';
  });

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  login(): void {
    this.router.navigateByUrl('/login');
  }

  navigateToWallet(): void {
    this.router.navigateByUrl('/wallet');
  }

  navigateToProfile(): void {
    this.router.navigateByUrl('/profile');
  }

  toggleDropdown(itemLabel: string): void {
    const currentOpen = this.openDropdown();
    if (currentOpen === itemLabel) {
      this.openDropdown.set(null);
    } else {
      this.openDropdown.set(itemLabel);
    }
  }

  isDropdownOpen(itemLabel: string): boolean {
    return this.openDropdown() === itemLabel;
  }

  closeDropdown(): void {
    this.openDropdown.set(null);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.menu-item-container')) {
      this.closeDropdown();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!this.isBrowser) return;

    const currentScrollY = window.scrollY;
    const lastScroll = this.lastScrollY();

    // Show header when at top of page
    if (currentScrollY <= 0) {
      this.isHeaderVisible.set(true);
      this.lastScrollY.set(currentScrollY);
      return;
    }

    // Hide header when scrolling down, show when scrolling up
    if (currentScrollY > lastScroll && currentScrollY > 100) {
      // Scrolling down and past 100px
      this.isHeaderVisible.set(false);
    } else if (currentScrollY < lastScroll) {
      // Scrolling up
      this.isHeaderVisible.set(true);
    }

    this.lastScrollY.set(currentScrollY);
  }
}
