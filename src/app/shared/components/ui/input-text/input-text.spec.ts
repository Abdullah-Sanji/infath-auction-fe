import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputText } from './input-text';

describe('InputText', () => {
  let component: InputText;
  let fixture: ComponentFixture<InputText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputText, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(InputText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default value as null', () => {
    expect(component.value()).toBe(null);
  });

  it('should update value', () => {
    component.value.set('Test Input');
    fixture.detectChanges();

    expect(component.value()).toBe('Test Input');
  });

  it('should emit onInput event', () => {
    spyOn(component.onInput, 'emit');
    const mockEvent = new Event('input');

    component.onInput.emit(mockEvent);

    expect(component.onInput.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onFocus event', () => {
    spyOn(component.onFocus, 'emit');
    const mockEvent = new Event('focus');

    component.onFocus.emit(mockEvent);

    expect(component.onFocus.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onBlur event', () => {
    spyOn(component.onBlur, 'emit');
    const mockEvent = new Event('blur');

    component.onBlur.emit(mockEvent);

    expect(component.onBlur.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onKeyDown event', () => {
    spyOn(component.onKeyDown, 'emit');
    const mockEvent = new KeyboardEvent('keydown');

    component.onKeyDown.emit(mockEvent);

    expect(component.onKeyDown.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onKeyUp event', () => {
    spyOn(component.onKeyUp, 'emit');
    const mockEvent = new KeyboardEvent('keyup');

    component.onKeyUp.emit(mockEvent);

    expect(component.onKeyUp.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onPaste event', () => {
    spyOn(component.onPaste, 'emit');
    const mockEvent = new ClipboardEvent('paste');

    component.onPaste.emit(mockEvent);

    expect(component.onPaste.emit).toHaveBeenCalledWith(mockEvent);
  });

  // ControlValueAccessor tests for ngModel support
  describe('ControlValueAccessor', () => {
    it('should write value through writeValue', () => {
      component.writeValue('Test Value');
      expect(component.value()).toBe('Test Value');
    });

    it('should write null value through writeValue', () => {
      component.writeValue('Initial');
      component.writeValue(null);
      expect(component.value()).toBe(null);
    });

    it('should register onChange callback', () => {
      const mockFn = jasmine.createSpy('onChange');
      component.registerOnChange(mockFn);
      
      component.value.set('New Value');
      fixture.detectChanges();
      
      expect(mockFn).toHaveBeenCalledWith('New Value');
    });

    it('should register onTouched callback', () => {
      const mockFn = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockFn);
      
      const mockEvent = new FocusEvent('blur');
      component.handleBlur(mockEvent);
      
      expect(mockFn).toHaveBeenCalled();
    });

    it('should call onTouched on blur', () => {
      const mockFn = jasmine.createSpy('onTouched');
      component.registerOnTouched(mockFn);
      
      const mockEvent = new FocusEvent('blur');
      component.handleBlur(mockEvent);
      
      expect(mockFn).toHaveBeenCalled();
    });

    it('should support two-way binding with ngModel', () => {
      const mockOnChange = jasmine.createSpy('onChange');
      component.registerOnChange(mockOnChange);
      
      // Simulate ngModel writing value
      component.writeValue('Initial Value');
      expect(component.value()).toBe('Initial Value');
      
      // Simulate user input
      component.value.set('Updated Value');
      fixture.detectChanges();
      
      expect(mockOnChange).toHaveBeenCalledWith('Updated Value');
    });
  });

  it('should have default values', () => {
    expect(component.type()).toBe('text');
    expect(component.disabled()).toBe(false);
    expect(component.readonly()).toBe(false);
    expect(component.autocomplete()).toBe('off');
  });
});
