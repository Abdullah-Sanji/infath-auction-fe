import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Accordion } from './accordion';

describe('Accordion', () => {
  let component: Accordion;
  let fixture: ComponentFixture<Accordion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accordion]
    }).compileComponents();

    fixture = TestBed.createComponent(Accordion);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with closed state by default', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();
    
    expect(component.expanded()).toBe(false);
  });

  it('should initialize with open state when isOpen is true', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.componentRef.setInput('isOpen', true);
    component.ngOnInit();
    fixture.detectChanges();
    
    expect(component.expanded()).toBe(true);
  });

  it('should display the title', () => {
    const testTitle = 'Test Accordion Title';
    fixture.componentRef.setInput('title', testTitle);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('p');
    expect(titleElement?.textContent?.trim()).toBe(testTitle);
  });

  it('should toggle expanded state when clicked', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    expect(component.expanded()).toBe(false);

    const button = fixture.nativeElement.querySelector('button');
    button?.click();
    fixture.detectChanges();

    expect(component.expanded()).toBe(true);

    button?.click();
    fixture.detectChanges();

    expect(component.expanded()).toBe(false);
  });

  it('should emit toggle event with new state', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    let emittedValue: boolean | undefined;
    component.toggle.subscribe((value: boolean) => {
      emittedValue = value;
    });

    component.onToggle();
    expect(emittedValue).toBe(true);

    component.onToggle();
    expect(emittedValue).toBe(false);
  });

  it('should show content when expanded', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    let contentDiv = fixture.nativeElement.querySelector('.animate-slideDown');
    expect(contentDiv).toBeNull();

    component.expanded.set(true);
    fixture.detectChanges();

    contentDiv = fixture.nativeElement.querySelector('.animate-slideDown');
    expect(contentDiv).toBeTruthy();
  });

  it('should hide content when collapsed', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    component.expanded.set(true);
    fixture.detectChanges();

    let contentDiv = fixture.nativeElement.querySelector('.animate-slideDown');
    expect(contentDiv).toBeTruthy();

    component.expanded.set(false);
    fixture.detectChanges();

    contentDiv = fixture.nativeElement.querySelector('.animate-slideDown');
    expect(contentDiv).toBeNull();
  });

  it('should have correct aria-expanded attribute', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button');
    expect(button?.getAttribute('aria-expanded')).toBe('false');

    component.expanded.set(true);
    fixture.detectChanges();

    expect(button?.getAttribute('aria-expanded')).toBe('true');
  });

  it('should rotate icon when expanded', () => {
    fixture.componentRef.setInput('title', 'Test Title');
    fixture.detectChanges();

    const iconWrapper = fixture.nativeElement.querySelector('.w-8.h-8');
    expect(iconWrapper?.classList.contains('rotate-180')).toBe(false);

    component.expanded.set(true);
    fixture.detectChanges();

    expect(iconWrapper?.classList.contains('rotate-180')).toBe(true);
  });
});
