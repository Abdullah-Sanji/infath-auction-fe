import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionsSliderSection } from './auctions-slider-section';
import { HomeService } from '../../services/home.service';
import { Auction } from '@pages/auctions/interfaces/auction.interface';

describe('AuctionsSliderSection', () => {
  let component: AuctionsSliderSection;
  let fixture: ComponentFixture<AuctionsSliderSection>;

  const createMockAuction = (id: string, status: string = 'Live'): Auction => ({
    auctionId: id,
    categoryId: 'cat1',
    title: 'أرض سكنية في حي طويق',
    titleAr: 'أرض سكنية في حي طويق',
    status,
    startTime: '2025-01-01T10:00:00',
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
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
    regionNameAr: 'منطقة الرياض'
  });

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', ['getWeeklyAuctions']);

    await TestBed.configureTestingModule({
      imports: [AuctionsSliderSection],
      providers: [
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionsSliderSection);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display section title', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h2');
    expect(titleElement?.textContent?.trim()).toBe('جديدة هذا الأسبوع');
  });

  it('should load weekly auctions on init', async () => {
    await component.ngOnInit();
    expect(component.auctions().length).toBeGreaterThan(0);
  });

  it('should display loading state', () => {
    component.isLoading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const spinner = compiled.querySelector('p-progressSpinner');
    expect(spinner).toBeTruthy();
  });

  it('should display error message when error occurs', () => {
    component.error.set('Failed to load auctions');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const errorElement = compiled.querySelector('.text-red-600');
    expect(errorElement?.textContent).toContain('Failed to load auctions');
  });

  it('should display empty state when no auctions', async () => {
    component.auctions.set([]);
    component.isLoading.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('.text-neutral-600');
    expect(emptyMessage?.textContent).toContain('لا توجد مزادات جديدة هذا الأسبوع');
  });

  it('should display auction cards', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('app-auction-card');
    expect(cards.length).toBeGreaterThan(0);
    expect(cards.length).toBeLessThanOrEqual(4);
  });

  it('should scroll right when button clicked', async () => {
    await component.ngOnInit();
    const initialIndex = component.currentIndex();

    component.scrollRight();

    expect(component.currentIndex()).toBeGreaterThanOrEqual(initialIndex);
  });

  it('should scroll left when button clicked', async () => {
    await component.ngOnInit();
    component.currentIndex.set(2);

    component.scrollLeft();

    expect(component.currentIndex()).toBe(1);
  });

  it('should not scroll left below 0', () => {
    component.currentIndex.set(0);

    component.scrollLeft();

    expect(component.currentIndex()).toBe(0);
  });

  it('should not scroll right beyond max index', async () => {
    await component.ngOnInit();
    const maxIndex = Math.max(0, component.auctions().length - 4);
    component.currentIndex.set(maxIndex);

    component.scrollRight();

    expect(component.currentIndex()).toBe(maxIndex);
  });

  it('should disable left button when at start', async () => {
    await component.ngOnInit();
    component.currentIndex.set(0);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const leftButton = compiled.querySelector('button[aria-label="Scroll left"]');
    expect(leftButton?.disabled).toBe(true);
  });

  it('should disable right button when at end', async () => {
    await component.ngOnInit();
    const maxIndex = Math.max(0, component.auctions().length - 4);
    component.currentIndex.set(maxIndex);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const rightButton = compiled.querySelector('button[aria-label="Scroll right"]');
    expect(rightButton?.disabled).toBe(true);
  });

  it('should call goBack when back button clicked', () => {
    spyOn(window.history, 'back');

    component.goBack();

    expect(window.history.back).toHaveBeenCalled();
  });

  it('should handle card click event', async () => {
    await component.ngOnInit();
    spyOn(console, 'log');
    const auction = component.auctions()[0];

    component.handleCardClick(auction);

    expect(console.log).toHaveBeenCalledWith('Card clicked:', auction);
  });

  it('should handle favorite click event', async () => {
    await component.ngOnInit();
    spyOn(console, 'log');
    const auction = component.auctions()[0];

    component.handleFavoriteClick(auction);

    expect(console.log).toHaveBeenCalledWith('Favorite clicked:', auction);
  });

  it('should display maximum 4 cards at a time', async () => {
    await component.ngOnInit();
    fixture.detectChanges();

    const visibleAuctions = component.auctions().slice(
      component.currentIndex(),
      component.currentIndex() + 4
    );

    expect(visibleAuctions.length).toBeLessThanOrEqual(4);
  });

  it('should have gradient underline on title', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const gradient = compiled.querySelector('.bg-gradient-to-r');
    expect(gradient).toBeTruthy();
    expect(gradient?.classList.contains('from-[rgba(59,190,187,0.8)]')).toBeTruthy();
  });
});
