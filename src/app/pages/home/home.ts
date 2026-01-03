import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './services/home.service';
import { HeroSection } from './components/hero-section/hero-section';
import { FeaturesSection } from './components/features-section/features-section';
import { AuctionsSliderSection } from './components/auctions-slider-section/auctions-slider-section';
import { StatsSection } from './components/stats-section/stats-section';
import { FaqSection } from './components/faq-section/faq-section';
import { CtaSection } from './components/cta-section/cta-section';
import { AppDownloadSection } from './components/app-download-section/app-download-section';
import { MapAuctionsSection } from './components/map-auctions-section/map-auctions-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HeroSection, FeaturesSection, AuctionsSliderSection, StatsSection, FaqSection, CtaSection, AppDownloadSection, MapAuctionsSection],
  providers: [HomeService],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  onSearchClick(event: {
    price: string | null;
    date: Date | null;
    auctionType: string | null;
  }): void {
    console.log(event);
  }
}
