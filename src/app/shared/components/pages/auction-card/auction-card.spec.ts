import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionCard, AuctionCardData } from './auction-card';

describe('AuctionCard', () => {
  let component: AuctionCard;
  let fixture: ComponentFixture<AuctionCard>;

  const mockAuction: AuctionCardData = {
    id: 1,
    title: 'أرض سكنية في حي طويق',
    highestBid: 200000,
    endDate: new Date('2025-01-05'),
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    isLive: true,
    isFavorited: false,
    participantsCount: 15,
    timeRemaining: '4 أيام 3 ساعات 40 دقيقة'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('auction', mockAuction);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display auction title', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.text-\\[15px\\].font-semibold');
    expect(titleElement?.textContent?.trim()).toContain('أرض سكنية في حي طويق');
  });

  it('should display highest bid with formatted currency', () => {
    const compiled = fixture.nativeElement;
    const bidElement = compiled.querySelector('.text-primary-600');
    expect(bidElement?.textContent?.trim()).toContain('200,000');
  });

  it('should display live status tag when auction is live', () => {
    const compiled = fixture.nativeElement;
    const liveTag = compiled.querySelector('.bg-success-700');
    expect(liveTag).toBeTruthy();
    expect(liveTag?.textContent?.trim()).toContain('مباشر الآن');
  });

  it('should not display live status tag when auction is not live', () => {
    const nonLiveAuction = { ...mockAuction, isLive: false };
    fixture.componentRef.setInput('auction', nonLiveAuction);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const liveTag = compiled.querySelector('.bg-success-700');
    expect(liveTag).toBeFalsy();
  });

  it('should display participants count', () => {
    const compiled = fixture.nativeElement;
    const participantsElement = compiled.querySelector('img[alt="Participants"]')?.parentElement?.querySelector('p');
    expect(participantsElement?.textContent?.trim()).toBe('15');
  });

  it('should display time remaining when provided', () => {
    const compiled = fixture.nativeElement;
    const timeElement = compiled.querySelector('.bg-neutral-50 p');
    expect(timeElement?.textContent?.trim()).toContain('4 أيام 3 ساعات 40 دقيقة');
  });

  it('should not display time remaining when not provided', () => {
    const auctionWithoutTime = { ...mockAuction, timeRemaining: undefined };
    fixture.componentRef.setInput('auction', auctionWithoutTime);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const timeTag = compiled.querySelector('.bg-neutral-50');
    expect(timeTag).toBeFalsy();
  });

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

  it('should have hover effect classes', () => {
    const compiled = fixture.nativeElement;
    const cardElement = compiled.querySelector('.bg-white');
    expect(cardElement?.classList.contains('hover:shadow-lg')).toBeTruthy();
    expect(cardElement?.classList.contains('transition-shadow')).toBeTruthy();
  });
});
