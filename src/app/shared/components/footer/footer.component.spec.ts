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

  describe('Accessibility Functions', () => {
    describe('onMagnifierClick', () => {
      it('should initialize zoom level at 100%', () => {
        expect(component.zoomLevel()).toBe(100);
      });

      it('should increase zoom level from 100% to 125%', () => {
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(125);
        expect(document.documentElement.style.fontSize).toBe('125%');
      });

      it('should increase zoom level from 125% to 150%', () => {
        component.zoomLevel.set(125);
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(150);
        expect(document.documentElement.style.fontSize).toBe('150%');
      });

      it('should reset zoom level from 150% to 100%', () => {
        component.zoomLevel.set(150);
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(100);
        expect(document.documentElement.style.fontSize).toBe('100%');
      });

      it('should cycle through all zoom levels', () => {
        // Start at 100%
        expect(component.zoomLevel()).toBe(100);

        // Click 1: 100% -> 125%
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(125);

        // Click 2: 125% -> 150%
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(150);

        // Click 3: 150% -> 100%
        component.onMagnifierClick();
        expect(component.zoomLevel()).toBe(100);
      });
    });

    describe('onVisibilityClick', () => {
      it('should initialize high contrast as disabled', () => {
        expect(component.highContrastEnabled()).toBe(false);
      });

      it('should enable high contrast mode', () => {
        component.onVisibilityClick();
        expect(component.highContrastEnabled()).toBe(true);
        expect(document.documentElement.classList.contains('high-contrast')).toBe(true);
      });

      it('should disable high contrast mode', () => {
        component.highContrastEnabled.set(true);
        document.documentElement.classList.add('high-contrast');

        component.onVisibilityClick();
        expect(component.highContrastEnabled()).toBe(false);
        expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
      });

      it('should toggle high contrast mode on and off', () => {
        // Initially disabled
        expect(component.highContrastEnabled()).toBe(false);

        // Enable
        component.onVisibilityClick();
        expect(component.highContrastEnabled()).toBe(true);
        expect(document.documentElement.classList.contains('high-contrast')).toBe(true);

        // Disable
        component.onVisibilityClick();
        expect(component.highContrastEnabled()).toBe(false);
        expect(document.documentElement.classList.contains('high-contrast')).toBe(false);
      });
    });

    describe('onFullscreenClick', () => {
      it('should initialize fullscreen as false', () => {
        expect(component.isFullscreen()).toBe(false);
      });

      it('should request fullscreen when not in fullscreen', async () => {
        const requestFullscreenSpy = spyOn(
          document.documentElement,
          'requestFullscreen'
        ).and.returnValue(Promise.resolve());

        await component.onFullscreenClick();

        expect(requestFullscreenSpy).toHaveBeenCalled();
      });

      it('should exit fullscreen when in fullscreen', async () => {
        // Mock fullscreen state
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: document.documentElement,
        });

        const exitFullscreenSpy = spyOn(document, 'exitFullscreen').and.returnValue(
          Promise.resolve()
        );

        await component.onFullscreenClick();

        expect(exitFullscreenSpy).toHaveBeenCalled();

        // Cleanup
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: null,
        });
      });

      it('should update isFullscreen signal when entering fullscreen', async () => {
        spyOn(document.documentElement, 'requestFullscreen').and.returnValue(
          Promise.resolve()
        );

        await component.onFullscreenClick();

        expect(component.isFullscreen()).toBe(true);
      });

      it('should update isFullscreen signal when exiting fullscreen', async () => {
        // Set initial state
        component.isFullscreen.set(true);

        // Mock fullscreen state
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: document.documentElement,
        });

        spyOn(document, 'exitFullscreen').and.returnValue(Promise.resolve());

        await component.onFullscreenClick();

        expect(component.isFullscreen()).toBe(false);

        // Cleanup
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: null,
        });
      });

      it('should handle fullscreen request errors gracefully', async () => {
        const consoleErrorSpy = spyOn(console, 'error');
        spyOn(document.documentElement, 'requestFullscreen').and.returnValue(
          Promise.reject(new Error('Fullscreen not allowed'))
        );

        await component.onFullscreenClick();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to enter fullscreen:',
          jasmine.any(Error)
        );
      });

      it('should handle fullscreen exit errors gracefully', async () => {
        const consoleErrorSpy = spyOn(console, 'error');

        // Mock fullscreen state
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: document.documentElement,
        });

        spyOn(document, 'exitFullscreen').and.returnValue(
          Promise.reject(new Error('Exit fullscreen failed'))
        );

        await component.onFullscreenClick();

        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to exit fullscreen:',
          jasmine.any(Error)
        );

        // Cleanup
        Object.defineProperty(document, 'fullscreenElement', {
          writable: true,
          configurable: true,
          value: null,
        });
      });
    });
  });
});

