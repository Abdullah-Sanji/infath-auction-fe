import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
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

  currentLang = this.translocoService.langChanges$;

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
}
