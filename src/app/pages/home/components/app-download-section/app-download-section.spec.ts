import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppDownloadSection } from './app-download-section';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoModule } from '@testing/transloco-testing.module';

describe('AppDownloadSection', () => {
  let component: AppDownloadSection;
  let fixture: ComponentFixture<AppDownloadSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDownloadSection, getTranslocoModule()],
    }).compileComponents();

    fixture = TestBed.createComponent(AppDownloadSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('h2');
    expect(title).toBeTruthy();
  });

  it('should render the description', () => {
    const compiled = fixture.nativeElement;
    const description = compiled.querySelector('p');
    expect(description).toBeTruthy();
  });

  it('should render mobile app image', () => {
    const compiled = fixture.nativeElement;
    const mobileImage = compiled.querySelector('img[src="/images/icons/infath-mobile.png"]');
    expect(mobileImage).toBeTruthy();
  });

  it('should render four feature items', () => {
    const compiled = fixture.nativeElement;
    const featureItems = compiled.querySelectorAll('.flex.items-start.justify-end.gap-2.w-full');
    expect(featureItems.length).toBe(4);
  });

  it('should render checkmark icons for each feature', () => {
    const compiled = fixture.nativeElement;
    const checkmarkIcons = compiled.querySelectorAll('svg');
    expect(checkmarkIcons.length).toBeGreaterThanOrEqual(4);
  });

  it('should render app store button with correct link', () => {
    const compiled = fixture.nativeElement;
    const appStoreLink = compiled.querySelector('a[href="https://apps.apple.com"]');
    expect(appStoreLink).toBeTruthy();
    expect(appStoreLink?.getAttribute('target')).toBe('_blank');
    expect(appStoreLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render google play button with correct link', () => {
    const compiled = fixture.nativeElement;
    const googlePlayLink = compiled.querySelector('a[href="https://play.google.com"]');
    expect(googlePlayLink).toBeTruthy();
    expect(googlePlayLink?.getAttribute('target')).toBe('_blank');
    expect(googlePlayLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should render app store image', () => {
    const compiled = fixture.nativeElement;
    const appStoreImage = compiled.querySelector('img[src="/images/icons/app-store.svg"]');
    expect(appStoreImage).toBeTruthy();
  });

  it('should render google play image', () => {
    const compiled = fixture.nativeElement;
    const googlePlayImage = compiled.querySelector('img[src="/images/icons/google-play.svg"]');
    expect(googlePlayImage).toBeTruthy();
  });

  it('should have gradient underline on title', () => {
    const compiled = fixture.nativeElement;
    const gradientUnderline = compiled.querySelector('.bg-gradient-to-r.from-\\[rgba\\(59\\,190\\,187\\,0\\.8\\)\\]');
    expect(gradientUnderline).toBeTruthy();
  });

  it('should display experience title', () => {
    const compiled = fixture.nativeElement;
    const experienceTitle = compiled.querySelector('h3');
    expect(experienceTitle).toBeTruthy();
  });
});
