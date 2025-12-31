import { Component, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Breadcrumb, BreadcrumbItem } from '@shared/components/ui/breadcrumb/breadcrumb';
import {
  AuctionsFilter,
  AuctionsFilterData,
} from '@shared/components/pages/auctions-filter/auctions-filter';
import { AuctionCard } from '@shared/components/pages/auction-card/auction-card';
import { Paginator, PageState } from '@shared/components/ui/paginator/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { AuctionsService } from './services/auctions';
import { firstValueFrom } from 'rxjs';
import { Auction } from './interfaces/auction.interface';

@Component({
  selector: 'app-auctions',
  imports: [
    CommonModule,
    Breadcrumb,
    AuctionsFilter,
    AuctionCard,
    Paginator,
    ProgressSpinnerModule,
    MessageModule,
  ],
  templateUrl: './auctions.html',
  styleUrl: './auctions.scss',
  providers: [AuctionsService],
})
export class Auctions {
  private readonly auctionsService = inject(AuctionsService);
  private readonly platformId = inject(PLATFORM_ID);

  // Pagination state
  first = signal<number>(0);
  rows = signal<number>(20);
  pageIndex = signal<number>(1);
  totalRecords = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'الصفحة الرئيسية', route: ['/'], translationKey: 'nav.home' },
    { label: 'مزادات العقارات' },
  ]);

  async ngOnInit(): Promise<void> {
    await this.getAuctions();
  }

  async getAuctions(): Promise<void> {
    this.isLoading.set(true);

    try {
      const result = await firstValueFrom(
        this.auctionsService.getAuctions(this.pageIndex(), this.rows())
      );

      if (result.isSuccess && result.data) {
        this.auctions.set(result.data.items);
        this.totalRecords.set(result.data.totalCount);
        this.first.set((result.data.pageIndex - 1) * result.data.pageSize);
      } else {
        this.error.set(result.errorMessage || 'Failed to load auctions');
        this.auctions.set([]);
      }
    } catch (error) {
      console.error('Failed to load auctions:', error);
      this.auctions.set([]);
    } finally {
      this.isLoading.set(false);
    }
  }

  auctionsFilterData = signal<AuctionsFilterData[] | null>([
    {
      id: 'all-auctions',
      title: 'جميع المزادات',
      icon: 'images/icons/bid-green-filled.svg',
      numberOfItems: 50,
    },
    {
      id: 'residential-auctions',
      title: 'السكنية',
      icon: 'images/icons/residential.svg',
      numberOfItems: 50,
    },
    {
      id: 'agricultural-auctions',
      title: 'الزراعية',
      icon: 'images/icons/agricultural.svg',
      numberOfItems: 50,
    },
    {
      id: 'commercial-auctions',
      title: 'التجارية',
      icon: 'images/icons/commercial.svg',
      numberOfItems: 50,
    },
    {
      id: 'industrial-auctions',
      title: 'الصناعية',
      icon: 'images/icons/industrial.svg',
      numberOfItems: 50,
    },
  ]);

  // All auctions data
  auctions = signal<Auction[]>([]);

  onFilterChange(item: AuctionsFilterData): void {
    console.log('Filter changed:', item);
  }

  onAuctionClick(auction: Auction): void {
    console.log('Auction clicked:', auction);
    // Navigate to auction details page
    // this.router.navigate(['/auctions', auction.auctionId]);
  }

  onFavoriteClick(auction: Auction): void {
    console.log('Favorite clicked:', auction);
  }

  async onPageChange(event: PageState): Promise<void> {
    // Update pagination state
    this.pageIndex.set(event.page + 1); // API uses 1-based indexing
    this.first.set(event.first);
    this.rows.set(event.rows);

    // Fetch new page data
    await this.getAuctions();

    // Scroll to top of auction list (only in browser)
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
