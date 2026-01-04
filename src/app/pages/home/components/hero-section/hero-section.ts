import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Dropdown } from '@shared/components/ui/dropdown/dropdown';
import { Datepicker } from '@shared/components/ui/datepicker/datepicker';

export interface PriceOption {
  label: string;
  value: string;
}

export interface AuctionTypeOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, TranslocoPipe, Dropdown, Datepicker],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  onSearchClick = output<{ price: string | null; date: Date | null; auctionType: string | null }>();

  selectedAuctionType = signal<string | null>(null);
  selectedPrice = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);

  // Filter options
  priceOptions: PriceOption[] = [
    { label: 'جميع الأسعار', value: 'all' },
    { label: 'أقل من 1000', value: '0-1000' },
    { label: '1000 - 5000', value: '1000-5000' },
    { label: '5000 - 10000', value: '5000-10000' },
    { label: 'أكثر من 10000', value: '10000+' },
  ];

  auctionTypeOptions: AuctionTypeOption[] = [
    { label: 'جميع الأنواع', value: 'all' },
    { label: 'البضائع العامة', value: 'general' },
    { label: 'الأصول المنقولة', value: 'movables' },
    { label: 'المركبات', value: 'vehicles' },
    { label: 'العقارات', value: 'realEstate' },
  ];

  /**
   * Handle search button click
   */
  _onSearchClick(): void {
    this.onSearchClick.emit({
      price: this.selectedPrice(),
      date: this.selectedDate(),
      auctionType: this.selectedAuctionType(),
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
