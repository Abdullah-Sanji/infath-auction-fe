import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { HomeService } from './services/home.service';
import { HomeData } from './interfaces/home.interface';
import { Dropdown } from '../../shared/components/ui/dropdown/dropdown';
import { Datepicker } from '../../shared/components/ui/datepicker/datepicker';

export interface PriceOption {
  label: string;
  value: string;
}

export interface AuctionTypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, TranslocoPipe, Dropdown, Datepicker],
  providers: [HomeService],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private homeService = inject(HomeService);

  homeData = signal<HomeData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Hero section filter signals
  selectedPrice = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);
  selectedAuctionType = signal<string | null>(null);

  // Filter options
  priceOptions: PriceOption[] = [
    { label: 'جميع الأسعار', value: 'all' },
    { label: 'أقل من 1000', value: '0-1000' },
    { label: '1000 - 5000', value: '1000-5000' },
    { label: '5000 - 10000', value: '5000-10000' },
    { label: 'أكثر من 10000', value: '10000+' }
  ];

  auctionTypeOptions: AuctionTypeOption[] = [
    { label: 'جميع الأنواع', value: 'all' },
    { label: 'البضائع العامة', value: 'general' },
    { label: 'الأصول المنقولة', value: 'movables' },
    { label: 'المركبات', value: 'vehicles' },
    { label: 'العقارات', value: 'realEstate' }
  ];

  ngOnInit(): void {
    this.loadHomeData();
  }

  /**
   * Load home page data from the service
   */
  private loadHomeData(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.homeService.getHomeData().subscribe({
      next: (data) => {
        this.homeData.set(data);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load home data:', error);
        this.error.set('Unable to load data. Please try again later.');
        this.isLoading.set(false);
        this.homeData.set(null);
      }
    });
  }

  /**
   * Handle search button click
   */
  onSearchClick(): void {
    // TODO: Implement search functionality
    console.log('Search clicked', {
      price: this.selectedPrice(),
      date: this.selectedDate(),
      auctionType: this.selectedAuctionType()
    });
  }

  /**
   * Handle price filter change
   */
  onPriceChange(event: { value: unknown }): void {
    this.selectedPrice.set(event.value as string | null);
  }

  /**
   * Handle date filter change
   */
  onDateChange(event: { value: Date | Date[] | string | string[] | null }): void {
    if (event.value instanceof Date) {
      this.selectedDate.set(event.value);
    } else {
      this.selectedDate.set(null);
    }
  }

  /**
   * Handle auction type filter change
   */
  onAuctionTypeChange(event: { value: unknown }): void {
    this.selectedAuctionType.set(event.value as string | null);
  }
}
