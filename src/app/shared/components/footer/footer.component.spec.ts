import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FooterComponent,
        RouterTestingModule,
        TranslocoTestingModule.forRoot({
          langs: { ar: {} },
          translocoConfig: {
            availableLangs: ['ar'],
            defaultLang: 'ar',
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return current year', () => {
    const currentYear = new Date().getFullYear();
    expect(component.currentYear).toBe(currentYear);
  });

  it('should have main navigation links', () => {
    expect(component.mainLinks).toBeDefined();
    expect(component.mainLinks.length).toBeGreaterThan(0);
    expect(component.mainLinks[0]).toHaveProperty('label');
    expect(component.mainLinks[0]).toHaveProperty('url');
  });

  it('should have my auctions links', () => {
    expect(component.myAuctionsLinks).toBeDefined();
    expect(component.myAuctionsLinks.length).toBeGreaterThan(0);
    expect(component.myAuctionsLinks[0]).toHaveProperty('label');
    expect(component.myAuctionsLinks[0]).toHaveProperty('url');
  });

  it('should have important pages links', () => {
    expect(component.importantPagesLinks).toBeDefined();
    expect(component.importantPagesLinks.length).toBeGreaterThan(0);
    expect(component.importantPagesLinks[0]).toHaveProperty('label');
    expect(component.importantPagesLinks[0]).toHaveProperty('url');
  });

  it('should render footer element', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const footer = compiled.querySelector('footer');
    expect(footer).toBeTruthy();
  });

  it('should render navigation sections', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const navSections = compiled.querySelectorAll('footer > div > div:first-child > div');
    expect(navSections.length).toBeGreaterThan(0);
  });

  it('should render legal section with copyright', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const legalSection = compiled.querySelector('footer > div > div:last-child');
    expect(legalSection).toBeTruthy();
  });

  it('should render privacy and terms links', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const privacyLink = Array.from(compiled.querySelectorAll('a')).find(
      (link) => link.getAttribute('ng-reflect-router-link') === '/privacy-policy'
    );
    const termsLink = Array.from(compiled.querySelectorAll('a')).find(
      (link) => link.getAttribute('ng-reflect-router-link') === '/terms-and-conditions'
    );
    expect(privacyLink).toBeTruthy();
    expect(termsLink).toBeTruthy();
  });

  it('should render contact section with phone number', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const phoneButton = compiled.querySelector('button');
    expect(phoneButton?.textContent).toContain('+966920000100');
  });

  it('should render social media buttons', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const socialButtons = compiled.querySelectorAll('button');
    expect(socialButtons.length).toBeGreaterThan(3); // Phone + 3 social + 3 accessibility
  });

  it('should render accessibility tools section', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const accessibilityButtons = compiled.querySelectorAll('button[class*="w-8 h-8"]');
    expect(accessibilityButtons.length).toBeGreaterThan(0);
  });

  it('should render logo images', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const logos = compiled.querySelectorAll('img[alt*="Logo"], img[alt*="Vision"], img[alt*="Nafath"]');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('should have correct link structure for main links', () => {
    component.mainLinks.forEach((link) => {
      expect(link.label).toMatch(/^footer\./);
      expect(link.url).toBeTruthy();
    });
  });

  it('should have correct link structure for my auctions links', () => {
    component.myAuctionsLinks.forEach((link) => {
      expect(link.label).toMatch(/^footer\./);
      expect(link.url).toBeTruthy();
    });
  });

  it('should have correct link structure for important pages links', () => {
    component.importantPagesLinks.forEach((link) => {
      expect(link.label).toMatch(/^footer\./);
      expect(link.url).toBeTruthy();
    });
  });
});

