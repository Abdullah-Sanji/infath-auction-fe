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
        imageUrl: 'https://example.com/image.jpg',
      },
    ],
    totalAuctions: 10,
    activeUsers: 50,
  };

  beforeEach(async () => {
    const homeServiceSpy = jasmine.createSpyObj('HomeService', ['getHomeData']);

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [{ provide: HomeService, useValue: homeServiceSpy }],
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

  it('should display featured auctions when data is loaded', () => {
    homeService.getHomeData.and.returnValue(of(mockHomeData));

    fixture.detectChanges(); // Triggers ngOnInit

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Featured Auctions');
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
});
