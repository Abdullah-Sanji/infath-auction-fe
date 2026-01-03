import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionCardHorizontal } from './auction-card-horizontal';
import { Router } from '@angular/router';
import { Auction } from '@pages/auctions/interfaces/auction.interface';

describe('AuctionCardHorizontal', () => {
  let component: AuctionCardHorizontal;
  let fixture: ComponentFixture<AuctionCardHorizontal>;
  let router: jasmine.SpyObj<Router>;

  const mockAuction: Auction = {
    auctionId: '1',
    title: 'Test Auction',
    primaryImageUrl: 'test.jpg',
    status: 'Live',
    endTime: new Date(Date.now() + 86400000).toISOString(),
    highestCurrentBid: 100000,
    totalBids: 15,
    startingPrice: 50000,
    depositAmount: 10000,
    description: 'Test Description',
    location: 'Test Location',
    category: 'Real Estate',
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuctionCardHorizontal],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(AuctionCardHorizontal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('auction', mockAuction);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display auction title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('h3')?.textContent).toContain('Test Auction');
  });

  it('should apply selected styles when isSelected is true', () => {
    fixture.componentRef.setInput('isSelected', true);
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('div');
    expect(cardElement.classList.contains('bg-[#f3fcf6]')).toBe(true);
    expect(cardElement.classList.contains('border-[#b8eacb]')).toBe(true);
  });

  it('should not apply selected styles when isSelected is false', () => {
    fixture.componentRef.setInput('isSelected', false);
    fixture.detectChanges();

    const cardElement = fixture.nativeElement.querySelector('div');
    expect(cardElement.classList.contains('bg-[#f3fcf6]')).toBe(false);
    expect(cardElement.classList.contains('border-[#b8eacb]')).toBe(false);
  });

  it('should emit onCardClick when card is clicked', () => {
    spyOn(component.onCardClick, 'emit');

    const cardElement = fixture.nativeElement.querySelector('div');
    cardElement.click();

    expect(component.onCardClick.emit).toHaveBeenCalledWith(mockAuction);
  });

  it('should emit onFavoriteClick when favorite button is clicked', () => {
    spyOn(component.onFavoriteClick, 'emit');

    const favoriteButton = fixture.nativeElement.querySelector('button[aria-label="Add to favorites"]');
    favoriteButton.click();

    expect(component.onFavoriteClick.emit).toHaveBeenCalledWith(mockAuction);
  });

  it('should stop propagation when favorite button is clicked', () => {
    spyOn(component.onCardClick, 'emit');
    spyOn(component.onFavoriteClick, 'emit');

    const favoriteButton = fixture.nativeElement.querySelector('button[aria-label="Add to favorites"]');
    favoriteButton.click();

    expect(component.onFavoriteClick.emit).toHaveBeenCalled();
    expect(component.onCardClick.emit).not.toHaveBeenCalled();
  });

  it('should show live status for Live auction', () => {
    expect(component.isLive()).toBe(true);
  });

  it('should show upcoming status for Upcoming auction', () => {
    const upcomingAuction = { ...mockAuction, status: 'Upcoming' as const };
    fixture.componentRef.setInput('auction', upcomingAuction);
    fixture.detectChanges();

    expect(component.isUpcoming()).toBe(true);
  });

  it('should format currency correctly', () => {
    const formatted = component.formatCurrency(100000);
    expect(formatted).toBe('100,000');
  });

  it('should display highest bid', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('100,000');
  });

  it('should display participants count', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('15');
  });

  it('should clean up interval on destroy', () => {
    spyOn(window, 'clearInterval');
    component.ngOnDestroy();
    expect(window.clearInterval).toHaveBeenCalled();
  });
});
