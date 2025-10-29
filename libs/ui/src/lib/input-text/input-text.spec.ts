import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputText } from './input-text';
import { FormsModule } from '@angular/forms';

describe('InputText', () => {
  let component: InputText;
  let fixture: ComponentFixture<InputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputText, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(InputText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value', () => {
    component.value.set('test value');
    fixture.detectChanges();
    expect(component.value()).toBe('test value');
  });

  it('should handle input with placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Enter text');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Enter text');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onInput event', () => {
    let emittedEvent: Event | undefined;
    component.onInput.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new Event('input');
    component.handleInput(mockEvent);

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

  it('should emit onFocus event', () => {
    let emittedEvent: FocusEvent | undefined;
    component.onFocus.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new FocusEvent('focus');
    component.handleFocus(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should support ControlValueAccessor writeValue', () => {
    component.writeValue('new value');
    expect(component.value()).toBe('new value');
  });

  it('should register onChange callback', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);

    component.value.set('test');

    // Wait for effect to trigger
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouchedSpy);

    const mockEvent = new FocusEvent('blur');
    component.handleBlur(mockEvent);

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should handle readonly state', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.detectChanges();
    expect(component.readonly()).toBe(true);
  });

  it('should handle invalid state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(component.invalid()).toBe(true);
  });

  it('should set maxlength', () => {
    fixture.componentRef.setInput('maxlength', 50);
    fixture.detectChanges();
    expect(component.maxlength()).toBe(50);
  });

  it('should emit keydown event', () => {
    let emittedEvent: KeyboardEvent | undefined;
    component.onKeyDown.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new KeyboardEvent('keydown');
    component.handleKeyDown(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit keyup event', () => {
    let emittedEvent: KeyboardEvent | undefined;
    component.onKeyUp.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new KeyboardEvent('keyup');
    component.handleKeyUp(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit paste event', () => {
    let emittedEvent: ClipboardEvent | undefined;
    component.onPaste.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new ClipboardEvent('paste');
    component.handlePaste(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });
});

