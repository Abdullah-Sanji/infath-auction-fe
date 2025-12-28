import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { HomeService } from './services/home.service';
import { of, throwError } from 'rxjs';
import { HomeData } from './interfaces/home.interface';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;
  let homeService: jasmine.SpyObj<HomeService>;

  const mockHomeData: HomeData = {
    featuredAuctions: [
      {
        id: '1',
        title: 'Test Auction',
        currentBid: 100,
        endDate: '2025-11-01T12:00:00Z',
        imageUrl: 'https://example.com/image.jpg'
      }
    ],
    totalAuctions: 10,
    activeUsers: 50
  };

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', ['getHomeData']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        { provide: HomeService, useValue: homeServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    homeService = TestBed.inject(HomeService) as jasmine.SpyObj<HomeService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load home data on init', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));

    fixture.detectChanges(); // Triggers ngOnInit

    expect(homeService.getHomeData).toHaveBeenCalled();
    expect(component.homeData()).toEqual(mockHomeData);
    expect(component.isLoading()).toBe(false);
    expect(component.error()).toBeNull();
  });

  it('should set loading state while fetching data', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));

    expect(component.isLoading()).toBe(false);

    fixture.detectChanges(); // Triggers ngOnInit

    // After completion, loading should be false
    expect(component.isLoading()).toBe(false);
  });

  it('should handle errors gracefully', () => {
    const errorResponse = new Error('API Error');
    homeService.getHomeData.and.returnValue(throwError(() => errorResponse));

    fixture.detectChanges(); // Triggers ngOnInit

    expect(component.error()).toBeTruthy();
    expect(component.error()).toContain('Unable to load data');
    expect(component.homeData()).toBeNull();
    expect(component.isLoading()).toBe(false);
  });

  it('should display statistics when data is loaded', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));

    fixture.detectChanges();

    const data = component.homeData();
    expect(data).toBeTruthy();
    expect(data!.totalAuctions).toBe(10);
    expect(data!.activeUsers).toBe(50);
  });

  it('should clear error when loading new data', () => {
    // First call fails
    homeService.getHomeData.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.error()).toBeTruthy();

    // Retry with success
    homeService.getHomeData.and.returnValue(of(mockHomeData));
    component.ngOnInit();

    expect(component.error()).toBeNull();
    expect(component.homeData()).toEqual(mockHomeData);
  });

  // Hero section tests
  it('should initialize hero section filter signals', () => {
    expect(component.selectedPrice()).toBeNull();
    expect(component.selectedDate()).toBeNull();
    expect(component.selectedAuctionType()).toBeNull();
  });

  it('should have price filter options', () => {
    expect(component.priceOptions.length).toBeGreaterThan(0);
    expect(component.priceOptions[0]).toHaveProperty('label');
    expect(component.priceOptions[0]).toHaveProperty('value');
  });

  it('should have auction type filter options', () => {
    expect(component.auctionTypeOptions.length).toBeGreaterThan(0);
    expect(component.auctionTypeOptions[0]).toHaveProperty('label');
    expect(component.auctionTypeOptions[0]).toHaveProperty('value');
  });

  it('should handle price filter change', () => {
    const event = { value: '1000-5000' };
    component.onPriceChange(event);
    expect(component.selectedPrice()).toBe('1000-5000');
  });

  it('should handle date filter change', () => {
    const testDate = new Date('2025-11-01');
    const event = { value: testDate };
    component.onDateChange(event);
    expect(component.selectedDate()).toEqual(testDate);
  });

  it('should handle date filter change with null value', () => {
    const event = { value: null };
    component.onDateChange(event);
    expect(component.selectedDate()).toBeNull();
  });

  it('should handle auction type filter change', () => {
    const event = { value: 'vehicles' };
    component.onAuctionTypeChange(event);
    expect(component.selectedAuctionType()).toBe('vehicles');
  });

  it('should handle search button click', () => {
    spyOn(console, 'log');
    component.selectedPrice.set('1000-5000');
    component.selectedDate.set(new Date('2025-11-01'));
    component.selectedAuctionType.set('vehicles');

    component.onSearchClick();

    expect(console.log).toHaveBeenCalledWith('Search clicked', {
      price: '1000-5000',
      date: new Date('2025-11-01'),
      auctionType: 'vehicles'
    });
  });

  it('should render hero section', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const heroSection = compiled.querySelector('.hero-section');
    expect(heroSection).toBeTruthy();
  });

  it('should render search bar', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const searchBar = compiled.querySelector('.search-bar');
    expect(searchBar).toBeTruthy();
  });

  it('should render filter dropdowns', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const filtersContainer = compiled.querySelector('.filters-container');
    expect(filtersContainer).toBeTruthy();
  });
});

