import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { HomeData } from '../interfaces/home.interface';
import { environment } from '../../../../environments/environment';

@Injectable()
export class HomeService {
  private apiUrl = environment.apiUrl;

  /**
   * Get home page data
   * For testing: returns mock JSON data
   * In production, this would make a real HTTP call
   */
  getHomeData(): Observable<HomeData> {
    // Mock data for testing
    const mockData: HomeData = {
      featuredAuctions: [
        {
          id: '1',
          title: 'Vintage Camera',
          currentBid: 250,
          endDate: '2025-11-01T12:00:00Z',
          imageUrl: 'https://via.placeholder.com/300x200?text=Vintage+Camera'
        },
        {
          id: '2',
          title: 'Antique Watch',
          currentBid: 450,
          endDate: '2025-11-02T15:30:00Z',
          imageUrl: 'https://via.placeholder.com/300x200?text=Antique+Watch'
        },
        {
          id: '3',
          title: 'Classic Guitar',
          currentBid: 800,
          endDate: '2025-11-03T18:00:00Z',
          imageUrl: 'https://via.placeholder.com/300x200?text=Classic+Guitar'
        },
        {
          id: '4',
          title: 'Rare Book Collection',
          currentBid: 1200,
          endDate: '2025-11-04T10:00:00Z',
          imageUrl: 'https://via.placeholder.com/300x200?text=Rare+Books'
        }
      ],
      totalAuctions: 156,
      activeUsers: 2341
    };

    // Simulate API delay
    return of(mockData).pipe(delay(500));

    // In production, use:
    // return this.http.get<HomeData>(`${this.apiUrl}/home`);
  }
}

