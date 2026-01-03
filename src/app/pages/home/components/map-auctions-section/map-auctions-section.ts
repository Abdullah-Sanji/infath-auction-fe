import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { AuctionCardHorizontal } from '@shared/components/pages/auction-card-horizontal/auction-card-horizontal';
import { Auction } from '@pages/auctions/interfaces/auction.interface';

interface SubCategory {
  id: string;
  label: string;
}

interface MainCategory {
  id: 'realEstate' | 'vehicles' | 'movables';
  titleKey: string;
  subtitleKey: string;
  icon: string;
}

@Component({
  selector: 'app-map-auctions-section',
  imports: [CommonModule, AuctionCardHorizontal, TranslocoModule],
  templateUrl: './map-auctions-section.html',
  styleUrl: './map-auctions-section.scss',
})
export class MapAuctionsSection {
  private router = inject(Router);
  selectedAuctionId = signal<string | null>(null);
  selectedMainCategory = signal<'realEstate' | 'vehicles' | 'movables'>('realEstate');
  selectedSubCategory = signal<string>('all');

  mainCategories = signal<MainCategory[]>([
    {
      id: 'realEstate',
      titleKey: 'categories.realEstate',
      subtitleKey: 'categories.nearestToYou',
      icon: 'residential.svg',
    },
    {
      id: 'vehicles',
      titleKey: 'categories.vehicles',
      subtitleKey: 'categories.selected',
      icon: 'commercial.svg',
    },
    {
      id: 'movables',
      titleKey: 'categories.movables',
      subtitleKey: 'categories.selected',
      icon: 'industrial.svg',
    },
  ]);

  subCategories = signal<SubCategory[]>([
    { id: 'all', label: 'categories.allCategories' },
    { id: 'residential', label: 'categories.residential' },
    { id: 'agricultural', label: 'categories.agricultural' },
    { id: 'commercial', label: 'categories.commercial' },
    { id: 'industrial', label: 'categories.industrial' },
  ]);

  // Mock auctions data
  auctions = signal<Auction[]>([
    {
      auctionId: '1',
      categoryId: '1',
      title: 'Residential Land in Tuwaiq District',
      titleAr: 'أرض سكنية في حي طويق',
      status: 'Live',
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 3 + 60000 * 40).toISOString(),
      timeRemaining: '4 days 3 hours 40 minutes',
      categoryName: 'Real Estate',
      categoryNameAr: 'العقارات',
      highestCurrentBid: 200000,
      startingPrice: 150000,
      totalBids: 15,
      primaryImageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400',
      location: 'Tuwaiq District',
      locationAr: 'حي طويق',
      regionId: '1',
      cityId: '1',
      countryName: 'Saudi Arabia',
      countryNameAr: 'المملكة العربية السعودية',
      cityName: 'Riyadh',
      cityNameAr: 'الرياض',
      regionName: 'Riyadh Region',
      regionNameAr: 'منطقة الرياض',
    },
    {
      auctionId: '2',
      categoryId: '1',
      title: 'Residential Land in Tuwaiq District',
      titleAr: 'أرض سكنية في حي طويق',
      status: 'Live',
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 3 + 60000 * 40).toISOString(),
      timeRemaining: '4 days 3 hours 40 minutes',
      categoryName: 'Real Estate',
      categoryNameAr: 'العقارات',
      highestCurrentBid: 200000,
      startingPrice: 150000,
      totalBids: 15,
      primaryImageUrl: 'https://images.unsplash.com/photo-1448630360428-65456885c650?w=400',
      location: 'Tuwaiq District',
      locationAr: 'حي طويق',
      regionId: '1',
      cityId: '1',
      countryName: 'Saudi Arabia',
      countryNameAr: 'المملكة العربية السعودية',
      cityName: 'Riyadh',
      cityNameAr: 'الرياض',
      regionName: 'Riyadh Region',
      regionNameAr: 'منطقة الرياض',
    },
    {
      auctionId: '3',
      categoryId: '1',
      title: 'Residential Land in Tuwaiq District',
      titleAr: 'أرض سكنية في حي طويق',
      status: 'Upcoming',
      startTime: new Date(Date.now() + 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 5 + 3600000 * 3 + 60000 * 40).toISOString(),
      timeRemaining: '5 days 3 hours 40 minutes',
      categoryName: 'Real Estate',
      categoryNameAr: 'العقارات',
      highestCurrentBid: 200000,
      startingPrice: 150000,
      totalBids: 15,
      primaryImageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      location: 'Tuwaiq District',
      locationAr: 'حي طويق',
      regionId: '1',
      cityId: '1',
      countryName: 'Saudi Arabia',
      countryNameAr: 'المملكة العربية السعودية',
      cityName: 'Riyadh',
      cityNameAr: 'الرياض',
      regionName: 'Riyadh Region',
      regionNameAr: 'منطقة الرياض',
    },
    {
      auctionId: '4',
      categoryId: '1',
      title: 'Residential Land in Tuwaiq District',
      titleAr: 'أرض سكنية في حي طويق',
      status: 'Live',
      startTime: new Date(Date.now() - 86400000).toISOString(),
      endTime: new Date(Date.now() + 86400000 * 4 + 3600000 * 3 + 60000 * 40).toISOString(),
      timeRemaining: '4 days 3 hours 40 minutes',
      categoryName: 'Real Estate',
      categoryNameAr: 'العقارات',
      highestCurrentBid: 200000,
      startingPrice: 150000,
      totalBids: 15,
      primaryImageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      location: 'Tuwaiq District',
      locationAr: 'حي طويق',
      regionId: '1',
      cityId: '1',
      countryName: 'Saudi Arabia',
      countryNameAr: 'المملكة العربية السعودية',
      cityName: 'Riyadh',
      cityNameAr: 'الرياض',
      regionName: 'Riyadh Region',
      regionNameAr: 'منطقة الرياض',
    },
  ]);

  handleAuctionClick(auction: Auction): void {
    this.selectedAuctionId.set(auction.auctionId);
  }

  handleFavoriteClick(auction: Auction): void {
    console.log('Favorite clicked:', auction);
    // TODO: Implement favorite functionality
  }

  handleViewAllAuctions(): void {
    this.router.navigate(['/auctions']);
  }

  selectMainCategory(category: 'realEstate' | 'vehicles' | 'movables'): void {
    this.selectedMainCategory.set(category);
    console.log('Main category selected:', category);
    // TODO: Filter auctions by main category
  }

  selectSubCategory(subCategoryId: string): void {
    this.selectedSubCategory.set(subCategoryId);
    console.log('Sub category selected:', subCategoryId);
    // TODO: Filter auctions by sub category
  }
}
