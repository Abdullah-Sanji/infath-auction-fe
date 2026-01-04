import { Component, inject, input, output, computed, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auction } from '@pages/auctions/interfaces/auction.interface';
import { calculateTimeRemaining } from '@core/utils/time.util';

@Component({
  selector: 'app-auction-card',
  imports: [CommonModule],
  templateUrl: './auction-card.html',
  styleUrl: './auction-card.scss',
})
export class AuctionCard implements OnDestroy {
  auction = input.required<Auction>();
  onCardClick = output<Auction>();
  onFavoriteClick = output<Auction>();
  router = inject(Router);

  // Signal to track current time for countdown updates
  private currentTime = signal<Date>(new Date());
  private intervalId?: number;

  constructor() {
    // Update current time every second for countdown
    if (typeof window !== 'undefined') {
      this.intervalId = window.setInterval(() => {
        this.currentTime.set(new Date());
      }, 1000);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId !== undefined && typeof window !== 'undefined') {
      window.clearInterval(this.intervalId);
    }
  }

  isLive = computed(() => {
    const status = this.auction().status;
    return status === 'Live' || status === 'Active';
  });

  // Calculate remaining time from endTime
  timeRemaining = computed(() => {
    return calculateTimeRemaining(this.auction().endTime, this.currentTime());
  });

  handleCardClick(): void {
    this.onCardClick.emit(this.auction());
    this.router.navigate(['/auctions', this.auction().auctionId]);
  }

  handleFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.onFavoriteClick.emit(this.auction());
  }

  formatCurrency(value: number): string {
    return value?.toLocaleString();
  }
}
