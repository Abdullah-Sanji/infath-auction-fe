import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { MapAuctionsSection } from './map-auctions-section';
import { AuctionCardHorizontal } from '@shared/components/pages/auction-card-horizontal/auction-card-horizontal';
import { Auction } from '@pages/auctions/interfaces/auction.interface';
import { getTranslocoModule } from '@core/services/transloco-loader';

describe('MapAuctionsSection', () => {
  let component: MapAuctionsSection;
  let fixture: ComponentFixture<MapAuctionsSection>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MapAuctionsSection, AuctionCardHorizontal, getTranslocoModule()],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(MapAuctionsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display map section', () => {
    const compiled = fixture.nativeElement;
    const mapSection = compiled.querySelector('.rounded-3xl');
    expect(mapSection).toBeTruthy();
  });

  it('should display auction cards', () => {
    const compiled = fixture.nativeElement;
    const cards = compiled.querySelectorAll('app-auction-card-horizontal');
    expect(cards.length).toBe(component.auctions().length);
  });

  it('should display price tags on map', () => {
    const compiled = fixture.nativeElement;
    const priceTags = compiled.querySelectorAll('.absolute.bg-white.border');
    expect(priceTags.length).toBeGreaterThan(0);
  });

  it('should display map controls', () => {
    const compiled = fixture.nativeElement;
    const controls = compiled.querySelector('.absolute.top-6.left-6');
    expect(controls).toBeTruthy();
  });

  it('should display zoom in button', () => {
    const compiled = fixture.nativeElement;
    const zoomInButton = compiled.querySelector('button[aria-label="Zoom in"]');
    expect(zoomInButton).toBeTruthy();
  });

  it('should display zoom out button', () => {
    const compiled = fixture.nativeElement;
    const zoomOutButton = compiled.querySelector('button[aria-label="Zoom out"]');
    expect(zoomOutButton).toBeTruthy();
  });

  it('should display center map button', () => {
    const compiled = fixture.nativeElement;
    const centerButton = compiled.querySelector('button[aria-label="Center map"]');
    expect(centerButton).toBeTruthy();
  });

  it('should have no selected auction initially', () => {
    expect(component.selectedAuctionId()).toBeNull();
  });

  it('should select auction when card is clicked', () => {
    const mockAuction: Auction = component.auctions()[0];
    component.handleAuctionClick(mockAuction);

    expect(component.selectedAuctionId()).toBe(mockAuction.auctionId);
  });

  it('should change selected auction when different card is clicked', () => {
    const firstAuction = component.auctions()[0];
    const secondAuction = component.auctions()[1];

    component.handleAuctionClick(firstAuction);
    expect(component.selectedAuctionId()).toBe(firstAuction.auctionId);

    component.handleAuctionClick(secondAuction);
    expect(component.selectedAuctionId()).toBe(secondAuction.auctionId);
  });

  it('should handle favorite click', () => {
    spyOn(console, 'log');
    const mockAuction = component.auctions()[0];

    component.handleFavoriteClick(mockAuction);

    expect(console.log).toHaveBeenCalledWith('Favorite clicked:', mockAuction);
  });

  it('should display selected pin on map', () => {
    const compiled = fixture.nativeElement;
    const pin = compiled.querySelector('.text-primary-600');
    expect(pin).toBeTruthy();
  });

  it('should display highlighted price tag for selected location', () => {
    const compiled = fixture.nativeElement;
    const highlightedTag = compiled.querySelector('.bg-primary-600.text-white');
    expect(highlightedTag).toBeTruthy();
  });

  it('should have correct number of price tags', () => {
    expect(component.priceTags().length).toBe(8);
  });

  it('should have correct number of auctions', () => {
    expect(component.auctions().length).toBe(4);
  });

  it('should display view all auctions button', () => {
    const compiled = fixture.nativeElement;
    const viewAllButton = compiled.querySelector('button');
    expect(viewAllButton).toBeTruthy();
  });

  it('should display auctions count', () => {
    const compiled = fixture.nativeElement;
    const countText = compiled.textContent;
    expect(countText).toContain('4');
  });

  it('should navigate to auctions page when view all button is clicked', () => {
    component.handleViewAllAuctions();
    expect(router.navigate).toHaveBeenCalledWith(['/auctions']);
  });

  it('should display divider below view all section', () => {
    const compiled = fixture.nativeElement;
    const divider = compiled.querySelector('.h-\\[0\\.823px\\]');
    expect(divider).toBeTruthy();
  });

  it('should display main category cards', () => {
    const compiled = fixture.nativeElement;
    const categoryButtons = compiled.querySelectorAll('button');
    expect(categoryButtons.length).toBeGreaterThan(3);
  });

  it('should have real estate as default selected main category', () => {
    expect(component.selectedMainCategory()).toBe('realEstate');
  });

  it('should change main category when clicked', () => {
    component.selectMainCategory('vehicles');
    expect(component.selectedMainCategory()).toBe('vehicles');

    component.selectMainCategory('movables');
    expect(component.selectedMainCategory()).toBe('movables');
  });

  it('should have all as default selected sub category', () => {
    expect(component.selectedSubCategory()).toBe('all');
  });

  it('should change sub category when clicked', () => {
    component.selectSubCategory('residential');
    expect(component.selectedSubCategory()).toBe('residential');

    component.selectSubCategory('commercial');
    expect(component.selectedSubCategory()).toBe('commercial');
  });

  it('should display all sub categories', () => {
    expect(component.subCategories().length).toBe(5);
  });

  it('should log main category selection', () => {
    spyOn(console, 'log');
    component.selectMainCategory('vehicles');
    expect(console.log).toHaveBeenCalledWith('Main category selected:', 'vehicles');
  });

  it('should log sub category selection', () => {
    spyOn(console, 'log');
    component.selectSubCategory('residential');
    expect(console.log).toHaveBeenCalledWith('Sub category selected:', 'residential');
  });
});
