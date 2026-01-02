import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuctionCard } from './auction-card';
import { Auction } from '@pages/auctions/interfaces/auction.interface';

describe('AuctionCard', () => {
  let component: AuctionCard;
  let fixture: ComponentFixture<AuctionCard>;

  const createMockAuction = (overrides?: Partial<Auction>): Auction => ({
    auctionId: '1',
    categoryId: 'cat1',
    title: 'أرض سكنية في حي طويق',
    titleAr: 'أرض سكنية في حي طويق',
    status: 'Live',
    startTime: '2025-01-01T10:00:00',
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    timeRemaining: '',
    categoryName: 'Residential',
    categoryNameAr: 'سكني',
    highestCurrentBid: 200000,
    startingPrice: 100000,
    totalBids: 15,
    primaryImageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    location: 'Riyadh',
    locationAr: 'الرياض',
    regionId: 'region1',
    cityId: 'city1',
    countryName: 'Saudi Arabia',
    countryNameAr: 'المملكة العربية السعودية',
    cityName: 'Riyadh',
    cityNameAr: 'الرياض',
    regionName: 'Riyadh Region',
    regionNameAr: 'منطقة الرياض',
    ...overrides
  });

  const mockAuction = createMockAuction();

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AuctionCard],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('auction', mockAuction);
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component) {
      component.ngOnDestroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display auction title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.text-xl.font-semibold');
    expect(titleElement?.textContent?.trim()).toContain('أرض سكنية في حي طويق');
  });

  it('should display highest bid with formatted currency', () => {
    const compiled = fixture.nativeElement;
    const bidElement = compiled.querySelector('.text-primary-600');
    expect(bidElement?.textContent?.trim()).toContain('200,000');
  });

  it('should display live status tag when auction is live', () => {
    const compiled = fixture.nativeElement;
    const liveTag = compiled.querySelector('.from-\\[\\#00A2A0\\]');
    expect(liveTag).toBeTruthy();
    expect(liveTag?.textContent?.trim()).toContain('مباشر الآن');
  });

  it('should display upcoming status tag when auction is upcoming', () => {
    const upcomingAuction = createMockAuction({ status: 'Upcoming' });
    fixture.componentRef.setInput('auction', upcomingAuction);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const upcomingTag = compiled.querySelector('.from-\\[\\#00365D\\]');
    expect(upcomingTag).toBeTruthy();
    expect(upcomingTag?.textContent?.trim()).toContain('مزاد قادم');
  });

  it('should not display status tag when auction is closed', () => {
    const closedAuction = createMockAuction({ status: 'Closed' });
    fixture.componentRef.setInput('auction', closedAuction);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const statusTags = compiled.querySelectorAll('.from-\\[\\#00A2A0\\], .from-\\[\\#00365D\\]');
    const visibleTags = Array.from(statusTags).filter((tag: any) => 
      !tag.classList.contains('opacity-0') && !tag.classList.contains('hidden')
    );
    expect(visibleTags.length).toBe(0);
  });

  it('should compute isUpcoming correctly', () => {
    const upcomingAuction = createMockAuction({ status: 'Upcoming' });
    fixture.componentRef.setInput('auction', upcomingAuction);
    fixture.detectChanges();

    expect(component.isUpcoming()).toBe(true);
    expect(component.isLive()).toBe(false);
  });

  it('should display participants count', () => {
    const compiled = fixture.nativeElement;
    const participantsElements = compiled.querySelectorAll('img[alt="Participants"]');
    expect(participantsElements.length).toBeGreaterThan(0);
    
    const participantCount = compiled.querySelector('img[alt="Participants"]')?.previousElementSibling;
    expect(participantCount?.textContent?.trim()).toBe('15');
  });

  it('should calculate and display time remaining from endTime', () => {
    const futureDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 40 * 60 * 1000);
    const auctionWithEndTime = createMockAuction({ endTime: futureDate.toISOString() });
    fixture.componentRef.setInput('auction', auctionWithEndTime);
    fixture.detectChanges();

    const timeRemaining = component.timeRemaining();
    expect(timeRemaining).toBeTruthy();
    expect(timeRemaining).toContain('أيام');
  });

  it('should not display time remaining when endTime is in the past', () => {
    const pastDate = new Date(Date.now() - 1000);
    const expiredAuction = createMockAuction({ endTime: pastDate.toISOString() });
    fixture.componentRef.setInput('auction', expiredAuction);
    fixture.detectChanges();

    const timeRemaining = component.timeRemaining();
    expect(timeRemaining).toBeNull();

    const compiled = fixture.nativeElement;
    const timeTag = compiled.querySelector('.bg-\\[\\#F7FDF9\\]');
    expect(timeTag).toBeFalsy();
  });

  it('should not display time remaining when endTime is missing', () => {
    const auctionWithoutEndTime = createMockAuction({ endTime: '' });
    fixture.componentRef.setInput('auction', auctionWithoutEndTime);
    fixture.detectChanges();

    const timeRemaining = component.timeRemaining();
    expect(timeRemaining).toBeNull();

    const compiled = fixture.nativeElement;
    const timeTag = compiled.querySelector('.bg-\\[\\#F7FDF9\\]');
    expect(timeTag).toBeFalsy();
  });

  it('should format time remaining correctly for days, hours, and minutes', () => {
    const futureDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000 + 30 * 60 * 1000);
    const auctionWithEndTime = createMockAuction({ endTime: futureDate.toISOString() });
    fixture.componentRef.setInput('auction', auctionWithEndTime);
    fixture.detectChanges();

    const timeRemaining = component.timeRemaining();
    expect(timeRemaining).toBeTruthy();
    expect(timeRemaining).toContain('أيام');
    expect(timeRemaining).toContain('ساعات');
  });

  it('should format time remaining correctly for hours and minutes only', () => {
    const futureDate = new Date(Date.now() + 3 * 60 * 60 * 1000 + 30 * 60 * 1000);
    const auctionWithEndTime = createMockAuction({ endTime: futureDate.toISOString() });
    fixture.componentRef.setInput('auction', auctionWithEndTime);
    fixture.detectChanges();

    const timeRemaining = component.timeRemaining();
    expect(timeRemaining).toBeTruthy();
    expect(timeRemaining).toContain('ساعات');
    expect(timeRemaining).toContain('دقائق');
  });

  it('should update time remaining every second', fakeAsync(() => {
    const futureDate = new Date(Date.now() + 1000); // 1 second from now
    const auctionWithEndTime = createMockAuction({ endTime: futureDate.toISOString() });
    fixture.componentRef.setInput('auction', auctionWithEndTime);
    fixture.detectChanges();

    const initialTime = component.timeRemaining();
    expect(initialTime).toBeTruthy();

    tick(1000);
    fixture.detectChanges();

    const updatedTime = component.timeRemaining();
    expect(updatedTime).toBeTruthy();
  }));

  it('should emit onCardClick when card is clicked', () => {
    spyOn(component.onCardClick, 'emit');
    const cardElement = fixture.nativeElement.querySelector('.bg-white');
    cardElement.click();
    expect(component.onCardClick.emit).toHaveBeenCalledWith(mockAuction);
  });

  it('should emit onFavoriteClick when favorite button is clicked', () => {
    spyOn(component.onFavoriteClick, 'emit');
    const favoriteButton = fixture.nativeElement.querySelector('button[aria-label="Add to favorites"]');
    favoriteButton.click();
    expect(component.onFavoriteClick.emit).toHaveBeenCalledWith(mockAuction);
  });

  it('should stop event propagation when favorite button is clicked', () => {
    spyOn(component.onCardClick, 'emit');
    spyOn(component.onFavoriteClick, 'emit');
    
    const favoriteButton = fixture.nativeElement.querySelector('button[aria-label="Add to favorites"]');
    favoriteButton.click();
    
    expect(component.onFavoriteClick.emit).toHaveBeenCalled();
    expect(component.onCardClick.emit).not.toHaveBeenCalled();
  });

  it('should format currency correctly', () => {
    expect(component.formatCurrency(200000)).toBe('200,000');
    expect(component.formatCurrency(1500000)).toBe('1,500,000');
    expect(component.formatCurrency(500)).toBe('500');
  });

  it('should display auction image with correct src', () => {
    const compiled = fixture.nativeElement;
    const imageElement = compiled.querySelector('img[alt="أرض سكنية في حي طويق"]');
    expect(imageElement?.src).toContain('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9');
  });

  it('should clean up interval on destroy', () => {
    if (typeof window !== 'undefined' && component['intervalId'] !== undefined) {
      spyOn(window, 'clearInterval');
      component.ngOnDestroy();
      expect(window.clearInterval).toHaveBeenCalled();
    }
  });

  it('should have hover effect classes', () => {
    const compiled = fixture.nativeElement;
    const cardElement = compiled.querySelector('.bg-white');
    expect(cardElement?.classList.contains('hover:shadow-lg')).toBeTruthy();
    expect(cardElement?.classList.contains('transition-shadow')).toBeTruthy();
  });
});
