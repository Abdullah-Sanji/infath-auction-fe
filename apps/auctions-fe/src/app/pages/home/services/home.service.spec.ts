import { TestBed } from '@angular/core/testing';
import { HomeService } from '../services/home.service';
import { HomeData } from '../interfaces/home.interface';

describe('HomeService', () => {
  let service: HomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeService],
    });
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return home data', (done) => {
    service.getHomeData().subscribe((data: HomeData) => {
      expect(data).toBeTruthy();
      expect(data.featuredAuctions).toBeTruthy();
      expect(data.featuredAuctions.length).toBeGreaterThan(0);
      expect(data.totalAuctions).toBeGreaterThan(0);
      expect(data.activeUsers).toBeGreaterThan(0);
      done();
    });
  });

  it('should return featured auctions with correct structure', (done) => {
    service.getHomeData().subscribe((data: HomeData) => {
      const auction = data.featuredAuctions[0];
      expect(auction.id).toBeTruthy();
      expect(auction.title).toBeTruthy();
      expect(typeof auction.currentBid).toBe('number');
      expect(auction.endDate).toBeTruthy();
      expect(auction.imageUrl).toBeTruthy();
      done();
    });
  });

  it('should return statistics', (done) => {
    service.getHomeData().subscribe((data: HomeData) => {
      expect(typeof data.totalAuctions).toBe('number');
      expect(typeof data.activeUsers).toBe('number');
      done();
    });
  });
});
