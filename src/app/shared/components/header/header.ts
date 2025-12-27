import { Component, inject, signal, computed, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/services/language.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router } from '@angular/router';

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
  styleUrl: './header.scss'
})
export class Header {
  protected authService = inject(AuthService);
  protected languageService = inject(LanguageService);
  protected router = inject(Router);
  protected walletBalance = signal<number>(10000);
  protected readonly isAuthenticated = this.authService.isAuthenticated;
  protected readonly userProfile = this.authService.userProfile;
  protected openDropdown = signal<string | null>(null);

  protected readonly menuItems = computed<MenuItem[]>(() => {
    const isAuth = this.isAuthenticated();
    const items: MenuItem[] = [
      {
        label: 'nav.home',
        route: ['/'],
        ariaLabel: 'nav.home',
        showWhenAuthenticated: true, // Always show
        children: [
          {
            label: 'nav.homeSubItem1',
            route: ['/home/subitem1'],
            ariaLabel: 'nav.homeSubItem1'
          },
          {
            label: 'nav.homeSubItem2',
            route: ['/home/subitem2'],
            ariaLabel: 'nav.homeSubItem2'
          }
        ]
      },
      {
        label: 'nav.myAuctions',
        route: ['/auctions'],
        ariaLabel: 'nav.myAuctions',
        showWhenAuthenticated: false // Show when NOT authenticated
      },
      {
        label: 'nav.myChats',
        route: ['/chats'],
        ariaLabel: 'nav.myChats',
        showWhenAuthenticated: false // Show when NOT authenticated
      },
      {
        label: 'nav.myOrders',
        route: ['/orders'],
        ariaLabel: 'nav.myOrders',
        showWhenAuthenticated: false // Show when NOT authenticated
      }
    ];

    return items.filter(item => {
      // Home always shows (showWhenAuthenticated: true)
      // Other items show when NOT authenticated (showWhenAuthenticated: false)
      return item.showWhenAuthenticated || !isAuth;
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
}

