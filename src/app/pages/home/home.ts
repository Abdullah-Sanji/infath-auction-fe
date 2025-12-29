import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './services/home.service';
import { HeroSection } from './components/hero-section/hero-section';

@Component({
  selector: 'app-home',
  imports: [CommonModule, HeroSection],
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
