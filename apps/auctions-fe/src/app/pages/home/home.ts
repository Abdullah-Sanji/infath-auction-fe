import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { Button } from 'primeng/button';
import { ProgressSpinner } from 'primeng/progressspinner';
import { Message } from 'primeng/message';
import { HomeService } from './services/home.service';
import { HomeData } from './interfaces/home.interface';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Card, Button, ProgressSpinner, Message],
  providers: [HomeService],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private homeService = inject(HomeService);

  homeData = signal<HomeData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

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
      },
    });
  }
}
