import { Component, signal, inject, OnInit, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuctionCard } from '@shared/components/pages/auction-card/auction-card';
import { Auction } from '@pages/auctions/interfaces/auction.interface';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-auctions-slider-section',
  imports: [CommonModule, TranslocoModule, ButtonModule, ProgressSpinnerModule, AuctionCard],
  templateUrl: './auctions-slider-section.html',
  styleUrl: './auctions-slider-section.scss'
})
export class AuctionsSliderSection implements OnInit {
  private homeService = inject(HomeService);

  auctions = signal<Auction[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  currentIndex = signal(0);
  title = input<string>('');

  async ngOnInit(): Promise<void> {
    await this.loadAuctions();
  }

  async loadAuctions(): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    try {
      // Mock data for now - replace with actual API call
      const mockAuctions: Auction[] = [
        {
          auctionId: '1',
          categoryId: 'cat1',
          title: 'أرض سكنية في حي طويق',
          titleAr: 'أرض سكنية في حي طويق',
          status: 'Live',
          startTime: '2025-01-01T10:00:00',
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
          timeRemaining: '',
          categoryName: 'Residential',
          categoryNameAr: 'سكني',
          highestCurrentBid: 200000,
          startingPrice: 100000,
          totalBids: 15,
          primaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
          location: 'Riyadh',
          locationAr: 'الرياض',
          regionId: 'region1',
          cityId: 'city1',
          countryName: 'Saudi Arabia',
          countryNameAr: 'المملكة العربية السعودية',
          cityName: 'Riyadh',
          cityNameAr: 'الرياض',
          regionName: 'Riyadh Region',
          regionNameAr: 'منطقة الرياض'
        },
        {
          auctionId: '2',
          categoryId: 'cat1',
          title: 'أرض سكنية في حي طويق',
          titleAr: 'أرض سكنية في حي طويق',
          status: 'Live',
          startTime: '2025-01-01T10:00:00',
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
          timeRemaining: '',
          categoryName: 'Residential',
          categoryNameAr: 'سكني',
          highestCurrentBid: 200000,
          startingPrice: 100000,
          totalBids: 15,
          primaryImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
          location: 'Riyadh',
          locationAr: 'الرياض',
          regionId: 'region1',
          cityId: 'city1',
          countryName: 'Saudi Arabia',
          countryNameAr: 'المملكة العربية السعودية',
          cityName: 'Riyadh',
          cityNameAr: 'الرياض',
          regionName: 'Riyadh Region',
          regionNameAr: 'منطقة الرياض'
        },
        {
          auctionId: '3',
          categoryId: 'cat1',
          title: 'أرض سكنية في حي طويق',
          titleAr: 'أرض سكنية في حي طويق',
          status: 'Upcoming',
          startTime: '2025-01-10T10:00:00',
          endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
          timeRemaining: '',
          categoryName: 'Residential',
          categoryNameAr: 'سكني',
          highestCurrentBid: 200000,
          startingPrice: 100000,
          totalBids: 15,
          primaryImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
          location: 'Riyadh',
          locationAr: 'الرياض',
          regionId: 'region1',
          cityId: 'city1',
          countryName: 'Saudi Arabia',
          countryNameAr: 'المملكة العربية السعودية',
          cityName: 'Riyadh',
          cityNameAr: 'الرياض',
          regionName: 'Riyadh Region',
          regionNameAr: 'منطقة الرياض'
        },
        {
          auctionId: '4',
          categoryId: 'cat1',
          title: 'أرض سكنية في حي طويق',
          titleAr: 'أرض سكنية في حي طويق',
          status: 'Live',
          startTime: '2025-01-01T10:00:00',
          endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 40 * 60 * 1000).toISOString(),
          timeRemaining: '',
          categoryName: 'Residential',
          categoryNameAr: 'سكني',
          highestCurrentBid: 200000,
          startingPrice: 100000,
          totalBids: 15,
          primaryImageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
          location: 'Riyadh',
          locationAr: 'الرياض',
          regionId: 'region1',
          cityId: 'city1',
          countryName: 'Saudi Arabia',
          countryNameAr: 'المملكة العربية السعودية',
          cityName: 'Riyadh',
          cityNameAr: 'الرياض',
          regionName: 'Riyadh Region',
          regionNameAr: 'منطقة الرياض'
        }
      ];

      this.auctions.set(mockAuctions);
    } catch (error) {
      console.error('Failed to load auctions:', error);
      this.error.set('Unable to load auctions. Please try again later.');
    } finally {
      this.isLoading.set(false);
    }
  }

  scrollLeft(): void {
    const newIndex = Math.max(0, this.currentIndex() - 1);
    this.currentIndex.set(newIndex);
  }

  scrollRight(): void {
    const maxIndex = Math.max(0, this.auctions().length - 4);
    const newIndex = Math.min(maxIndex, this.currentIndex() + 1);
    this.currentIndex.set(newIndex);
  }

  goBack(): void {
    // Navigate back or to auctions page
    window.history.back();
  }

  handleCardClick(auction: Auction): void {
    console.log('Card clicked:', auction);
  }

  handleFavoriteClick(auction: Auction): void {
    console.log('Favorite clicked:', auction);
  }
}
