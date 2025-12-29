import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private translocoService = inject(TranslocoService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  currentLang = this.translocoService.langChanges$;

  // Accessibility state
  zoomLevel = signal(100);
  highContrastEnabled = signal(false);
  isFullscreen = signal(false);

  get currentYear(): number {
    return new Date().getFullYear();
  }

  get isRTL(): boolean {
    return this.translocoService.getActiveLang() === 'ar';
  }

  // Main navigation links
  mainLinks = [
    { label: 'footer.nav.home', url: '/' },
    { label: 'footer.nav.currentAuctions', url: '/auctions' },
    { label: 'footer.nav.upcomingAuctions', url: '/auctions' },
  ];

  // My Auctions links
  myAuctionsLinks = [
    { label: 'footer.myAuctions.favorite', url: '/watchlist' },
    { label: 'footer.myAuctions.winning', url: '/my-bids' },
    { label: 'footer.myAuctions.ongoing', url: '/my-bids' },
  ];

  // Important pages links
  importantPagesLinks = [
    { label: 'footer.importantPages.myOrders', url: '/my-purchases' },
    { label: 'footer.importantPages.smartAssistant', url: '#' },
  ];

  /**
   * Toggle text magnification/zoom
   * Cycles through zoom levels: 100% -> 125% -> 150% -> 100%
   */
  onMagnifierClick(): void {
    if (!this.isBrowser) return;

    const currentZoom = this.zoomLevel();
    let newZoom: number;

    if (currentZoom === 100) {
      newZoom = 125;
    } else if (currentZoom === 125) {
      newZoom = 150;
    } else {
      newZoom = 100;
    }

    this.zoomLevel.set(newZoom);
    document.documentElement.style.fontSize = `${newZoom}%`;
  }

  /**
   * Toggle high contrast mode for better visibility
   * Adds/removes a CSS class to enable high contrast styles
   */
  onVisibilityClick(): void {
    if (!this.isBrowser) return;

    const newState = !this.highContrastEnabled();
    this.highContrastEnabled.set(newState);

    if (newState) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }

  /**
   * Toggle fullscreen mode
   * Enters/exits browser fullscreen mode
   */
  onFullscreenClick(): void {
    if (!this.isBrowser) return;

    if (!document.fullscreenElement) {
      // Enter fullscreen
      document.documentElement.requestFullscreen().then(() => {
        this.isFullscreen.set(true);
      }).catch((error) => {
        console.error('Failed to enter fullscreen:', error);
      });
    } else {
      // Exit fullscreen
      document.exitFullscreen().then(() => {
        this.isFullscreen.set(false);
      }).catch((error) => {
        console.error('Failed to exit fullscreen:', error);
      });
    }
  }
}
