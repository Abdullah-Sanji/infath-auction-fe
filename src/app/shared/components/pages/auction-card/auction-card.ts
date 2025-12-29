import { Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface AuctionCardData {
  id: number;
  title: string;
  highestBid: number;
  endDate: Date;
  imageUrl: string;
  isLive?: boolean;
  isFavorited?: boolean;
  participantsCount?: number;
  timeRemaining?: string;
}

@Component({
  selector: 'app-auction-card',
  imports: [CommonModule],
  templateUrl: './auction-card.html',
  styleUrl: './auction-card.scss',
})
export class AuctionCard {
  auction = input.required<AuctionCardData>();
  onCardClick = output<AuctionCardData>();
  onFavoriteClick = output<AuctionCardData>();
  router = inject(Router);
  handleCardClick(): void {
    this.onCardClick.emit(this.auction());
    this.router.navigate(['/auctions', this.auction().id]);
  }

  handleFavoriteClick(event: Event): void {
    event.stopPropagation();
    this.onFavoriteClick.emit(this.auction());
  }

  formatCurrency(value: number): string {
    return value.toLocaleString();
  }
}
