import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AuctionsFilterData {
  id: string;
  title: string;
  icon: string;
  numberOfItems: number;
}

@Component({
  selector: 'app-auctions-filter',
  imports: [CommonModule],
  templateUrl: './auctions-filter.html',
  styleUrl: './auctions-filter.scss',
})
export class AuctionsFilter {
  data = input<AuctionsFilterData[] | null>(null);
  onFilterChange = output<AuctionsFilterData>();

  selectedFilter = signal<AuctionsFilterData | null>(null);

  onFilterClick(item: AuctionsFilterData): void {
    this.selectedFilter.set(item);
    this.onFilterChange.emit(item);
  }
}
