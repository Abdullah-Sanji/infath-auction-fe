import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button],
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display label', () => {
    fixture.componentRef.setInput('label', 'Click Me');
    fixture.detectChanges();
    expect(component.label()).toBe('Click Me');
  });

  it('should set icon', () => {
    fixture.componentRef.setInput('icon', 'pi pi-check');
    fixture.detectChanges();
    expect(component.icon()).toBe('pi pi-check');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onClick event when clicked', () => {
    let emittedEvent: MouseEvent | undefined;
    component.onClick.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new MouseEvent('click');
    component.handleClick(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should not emit onClick event when disabled', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    let eventEmitted = false;
    component.onClick.subscribe(() => {
      eventEmitted = true;
    });

    const mockEvent = new MouseEvent('click');
    component.handleClick(mockEvent);

    expect(eventEmitted).toBe(false);
  });

  it('should not emit onClick event when loading', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    let eventEmitted = false;
    component.onClick.subscribe(() => {
      eventEmitted = true;
    });

    const mockEvent = new MouseEvent('click');
    component.handleClick(mockEvent);

    expect(eventEmitted).toBe(false);
  });

  it('should emit onFocus event', () => {
    let emittedEvent: FocusEvent | undefined;
    component.onFocus.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new FocusEvent('focus');
    component.handleFocus(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit onBlur event', () => {
    let emittedEvent: FocusEvent | undefined;
    component.onBlur.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new FocusEvent('blur');
    component.handleBlur(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should support loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(component.loading()).toBe(true);
  });

  it('should support severity', () => {
    fixture.componentRef.setInput('severity', 'success');
    fixture.detectChanges();
    expect(component.severity()).toBe('success');
  });

  it('should support raised style', () => {
    fixture.componentRef.setInput('raised', true);
    fixture.detectChanges();
    expect(component.raised()).toBe(true);
  });

  it('should support rounded style', () => {
    fixture.componentRef.setInput('rounded', true);
    fixture.detectChanges();
    expect(component.rounded()).toBe(true);
  });

  it('should support text style', () => {
    fixture.componentRef.setInput('text', true);
    fixture.detectChanges();
    expect(component.text()).toBe(true);
  });

  it('should support outlined style', () => {
    fixture.componentRef.setInput('outlined', true);
    fixture.detectChanges();
    expect(component.outlined()).toBe(true);
  });

  it('should support size', () => {
    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();
    expect(component.size()).toBe('small');
  });

  it('should support type attribute', () => {
    fixture.componentRef.setInput('type', 'submit');
    fixture.detectChanges();
    expect(component.type()).toBe('submit');
  });

  it('should support badge', () => {
    fixture.componentRef.setInput('badge', '5');
    fixture.detectChanges();
    expect(component.badge()).toBe('5');
  });

  it('should support iconPos', () => {
    fixture.componentRef.setInput('iconPos', 'right');
    fixture.detectChanges();
    expect(component.iconPos()).toBe('right');
  });
});

