import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Home } from './home';
import { HomeService } from './services/home.service';
import { getTranslocoModule } from '../../core/services/transloco-loader';

describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Home,
        getTranslocoModule()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle search click event', () => {
    const searchEvent = {
      price: '1000-5000',
      date: new Date('2025-11-01'),
      auctionType: 'vehicles'
    };

    spyOn(console, 'log');
    component.onSearchClick(searchEvent);

    expect(console.log).toHaveBeenCalledWith(searchEvent);
  });

  it('should render hero section component', () => {
    const compiled = fixture.nativeElement;
    const heroSection = compiled.querySelector('app-hero-section');
    expect(heroSection).toBeTruthy();
  });

  it('should render features section component', () => {
    const compiled = fixture.nativeElement;
    const featuresSection = compiled.querySelector('app-features-section');
    expect(featuresSection).toBeTruthy();
  });

  it('should render auction slider sections', () => {
    const compiled = fixture.nativeElement;
    const sliderSections = compiled.querySelectorAll('app-auctions-slider-section');
    expect(sliderSections.length).toBeGreaterThanOrEqual(2);
  });

  it('should render stats section component', () => {
    const compiled = fixture.nativeElement;
    const statsSection = compiled.querySelector('app-stats-section');
    expect(statsSection).toBeTruthy();
  });

  it('should render FAQ section component', () => {
    const compiled = fixture.nativeElement;
    const faqSection = compiled.querySelector('app-faq-section');
    expect(faqSection).toBeTruthy();
  });

  it('should render app download section component', () => {
    const compiled = fixture.nativeElement;
    const appDownloadSection = compiled.querySelector('app-download-section');
    expect(appDownloadSection).toBeTruthy();
  });

  it('should render CTA section component', () => {
    const compiled = fixture.nativeElement;
    const ctaSection = compiled.querySelector('app-cta-section');
    expect(ctaSection).toBeTruthy();
  });

  it('should render app download section before stats section', () => {
    const compiled = fixture.nativeElement;
    const sections = compiled.querySelectorAll('app-download-section, app-stats-section');
    expect(sections.length).toBe(2);
    expect(sections[0].tagName.toLowerCase()).toBe('app-download-section');
    expect(sections[1].tagName.toLowerCase()).toBe('app-stats-section');
  });

  it('should render stats section before FAQ section', () => {
    const compiled = fixture.nativeElement;
    const sections = compiled.querySelectorAll('app-stats-section, app-faq-section');
    expect(sections.length).toBe(2);
    expect(sections[0].tagName.toLowerCase()).toBe('app-stats-section');
    expect(sections[1].tagName.toLowerCase()).toBe('app-faq-section');
  });

  it('should render FAQ section before CTA section', () => {
    const compiled = fixture.nativeElement;
    const sections = compiled.querySelectorAll('app-faq-section, app-cta-section');
    expect(sections.length).toBe(2);
    expect(sections[0].tagName.toLowerCase()).toBe('app-faq-section');
    expect(sections[1].tagName.toLowerCase()).toBe('app-cta-section');
  });

  it('should have correct structure', () => {
    const compiled = fixture.nativeElement;
    const mainContainer = compiled.querySelector('.w-full');
    expect(mainContainer).toBeTruthy();
  });
});

