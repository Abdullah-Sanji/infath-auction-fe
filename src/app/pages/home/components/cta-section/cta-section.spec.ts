import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';
import { CtaSection } from './cta-section';

describe('CtaSection', () => {
  let component: CtaSection;
  let fixture: ComponentFixture<CtaSection>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CtaSection, TranslocoModule],
      providers: [{ provide: Router, useValue: routerSpy }],
    }).compileComponents();

    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(CtaSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the CTA section with correct structure', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const section = compiled.querySelector('section');
    expect(section).toBeTruthy();
    expect(section?.classList.contains('w-full')).toBe(true);
  });

  it('should render the CTA container with gradient background', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const container = compiled.querySelector('section > div');
    expect(container).toBeTruthy();
    expect(container?.classList.contains('relative')).toBe(true);
    expect(container?.classList.contains('rounded-3xl')).toBe(true);
  });

  it('should render decorative vectors', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const vectors = compiled.querySelectorAll('.mix-blend-overlay');
    expect(vectors.length).toBeGreaterThanOrEqual(2);
  });

  it('should render the title (h2 element)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('h2');
    expect(title).toBeTruthy();
    expect(title?.classList.contains('font-semibold')).toBe(true);
    expect(title?.classList.contains('text-white')).toBe(true);
  });

  it('should render the title underline', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const underline = compiled.querySelector('h2 + div');
    expect(underline).toBeTruthy();
    expect(underline?.classList.contains('h-4')).toBe(true);
    expect(underline?.classList.contains('opacity-80')).toBe(true);
  });

  it('should render the description paragraph', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const description = compiled.querySelector('p[dir="rtl"]');
    expect(description).toBeTruthy();
    expect(description?.classList.contains('text-white')).toBe(true);
  });

  it('should render the login button', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button');
    expect(button).toBeTruthy();
    expect(button?.classList.contains('bg-[#f3f4f6]')).toBe(true);
  });

  it('should navigate to login page when button is clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should call onLoginClick when button is clicked', () => {
    spyOn(component, 'onLoginClick');
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    button.click();
    expect(component.onLoginClick).toHaveBeenCalled();
  });

  it('should have button with text span', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttonText = compiled.querySelector('button span');
    expect(buttonText).toBeTruthy();
    expect(buttonText?.classList.contains('font-medium')).toBe(true);
  });

  it('should have responsive flex layout', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const content = compiled.querySelector('section > div > div');
    expect(content).toBeTruthy();
    expect(content?.classList.contains('flex')).toBe(true);
    expect(content?.classList.contains('flex-1')).toBe(true);
  });

  it('should have button with correct type attribute', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button') as HTMLButtonElement;
    expect(button.type).toBe('button');
  });
});
