import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Breadcrumb, BreadcrumbItem } from '@shared/components/ui/breadcrumb/breadcrumb';
import { AuctionsFilter, AuctionsFilterData } from '@shared/components/pages/auctions-filter/auctions-filter';
import { AuctionCard, AuctionCardData } from '@shared/components/pages/auction-card/auction-card';

@Component({
  selector: 'app-auctions',
  imports: [CommonModule, Breadcrumb, AuctionsFilter, AuctionCard],
  templateUrl: './auctions.html',
  styleUrl: './auctions.scss',
})
export class Auctions {

  breadcrumbItems = signal<BreadcrumbItem[]>([
    { label: 'الصفحة الرئيسية', route: ['/'], translationKey: 'nav.home' },
    { label: 'مزادات العقارات' },
  ]);

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
    }
  ]);

  auctions = signal<AuctionCardData[]>([
    {
      id: 1,
      title: 'أرض سكنية في حي طويق',
      highestBid: 200000,
      endDate: new Date('2025-01-05'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: true,
      isFavorited: false,
      participantsCount: 15,
      timeRemaining: '4 أيام 3 ساعات 40 دقيقة'
    },
    {
      id: 2,
      title: 'شقة فاخرة في حي الملقا',
      highestBid: 450000,
      endDate: new Date('2025-01-03'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: true,
      isFavorited: false,
      participantsCount: 23,
      timeRemaining: '2 أيام 5 ساعات 15 دقيقة'
    },
    {
      id: 3,
      title: 'فيلا سكنية في حي النرجس',
      highestBid: 1500000,
      endDate: new Date('2025-01-08'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: false,
      isFavorited: true,
      participantsCount: 42,
      timeRemaining: '7 أيام 12 ساعة 30 دقيقة'
    },
    {
      id: 4,
      title: 'أرض تجارية على شارع رئيسي',
      highestBid: 850000,
      endDate: new Date('2025-01-06'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: true,
      isFavorited: false,
      participantsCount: 31,
      timeRemaining: '5 أيام 8 ساعات 20 دقيقة'
    },
    {
      id: 5,
      title: 'مبنى سكني استثماري',
      highestBid: 3200000,
      endDate: new Date('2025-01-10'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: false,
      isFavorited: false,
      participantsCount: 18,
      timeRemaining: '9 أيام 4 ساعات 50 دقيقة'
    },
    {
      id: 6,
      title: 'أرض زراعية في الخرج',
      highestBid: 120000,
      endDate: new Date('2025-01-04'),
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
      isLive: true,
      isFavorited: true,
      participantsCount: 8,
      timeRemaining: '3 أيام 1 ساعة 10 دقائق'
    }
  ]);

  onFilterChange(item: AuctionsFilterData): void {
    console.log('Filter changed:', item);
  }

  onAuctionClick(auction: AuctionCardData): void {
    console.log('Auction clicked:', auction);
    // Navigate to auction details page
    // this.router.navigate(['/auctions', auction.id]);
  }

  onFavoriteClick(auction: AuctionCardData): void {
    console.log('Favorite clicked:', auction);
    // Toggle favorite status
    const updatedAuctions = this.auctions().map(a =>
      a.id === auction.id ? { ...a, isFavorited: !a.isFavorited } : a
    );
    this.auctions.set(updatedAuctions);
  }
}
