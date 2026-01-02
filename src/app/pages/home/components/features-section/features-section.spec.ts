import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturesSection } from './features-section';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoModule } from '../../../../core/services/transloco-loader';

describe('FeaturesSection', () => {
  let component: FeaturesSection;
  let fixture: ComponentFixture<FeaturesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesSection, getTranslocoModule()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturesSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 features', () => {
    expect(component.features().length).toBe(4);
  });

  it('should display all features in the template', () => {
    const compiled = fixture.nativeElement;
    const featureElements = compiled.querySelectorAll('.grid > div');
    expect(featureElements.length).toBe(4);
  });

  it('should have correct feature keys', () => {
    const features = component.features();
    expect(features[0].titleKey).toBe('home.features.unifiedPlatform.title');
    expect(features[1].titleKey).toBe('home.features.transparency.title');
    expect(features[2].titleKey).toBe('home.features.financing.title');
    expect(features[3].titleKey).toBe('home.features.securePayment.title');
  });

  it('should render icons for each feature', () => {
    const compiled = fixture.nativeElement;
    const icons = compiled.querySelectorAll('i.pi-check-circle');
    expect(icons.length).toBe(4);
  });

  it('should render titles and descriptions', () => {
    const compiled = fixture.nativeElement;
    const titles = compiled.querySelectorAll('h3');
    const descriptions = compiled.querySelectorAll('p');

    expect(titles.length).toBe(4);
    expect(descriptions.length).toBe(4);
  });

  it('should have proper text alignment (RTL)', () => {
    const compiled = fixture.nativeElement;
    const contentDivs = compiled.querySelectorAll('.text-right');
    expect(contentDivs.length).toBeGreaterThan(0);
  });

  it('should have proper styling classes', () => {
    const compiled = fixture.nativeElement;
    const section = compiled.querySelector('section');
    expect(section.classList.contains('bg-gray-50')).toBe(true);
  });
});
