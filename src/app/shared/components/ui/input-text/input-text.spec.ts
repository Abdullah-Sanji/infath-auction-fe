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

  it('should have default value as empty string', () => {
    expect(component.value()).toBe('');
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

  it('should emit onKeydown event', () => {
    spyOn(component.onKeydown, 'emit');
    const mockEvent = new KeyboardEvent('keydown');

    component.onKeydown.emit(mockEvent);

    expect(component.onKeydown.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onKeyup event', () => {
    spyOn(component.onKeyup, 'emit');
    const mockEvent = new KeyboardEvent('keyup');

    component.onKeyup.emit(mockEvent);

    expect(component.onKeyup.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onPaste event', () => {
    spyOn(component.onPaste, 'emit');
    const mockEvent = new ClipboardEvent('paste');

    component.onPaste.emit(mockEvent);

    expect(component.onPaste.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onClear event', () => {
    spyOn(component.onClear, 'emit');
    const mockEvent = new Event('clear');

    component.onClear.emit(mockEvent);

    expect(component.onClear.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should set disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('p-inputText');
    expect(input.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set placeholder', () => {
    component.placeholder.set('Enter text');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('p-inputText');
    expect(input.getAttribute('ng-reflect-placeholder')).toBe('Enter text');
  });

  it('should set type', () => {
    component.type.set('email');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('p-inputText');
    expect(input.getAttribute('ng-reflect-type')).toBe('email');
  });

  it('should set required state', () => {
    component.required.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const input = compiled.querySelector('p-inputText');
    expect(input.getAttribute('ng-reflect-required')).toBe('true');
  });

  it('should have default values', () => {
    expect(component.type()).toBe('text');
    expect(component.disabled()).toBe(false);
    expect(component.readonly()).toBe(false);
    expect(component.required()).toBe(false);
    expect(component.autocomplete()).toBe('off');
    expect(component.autofocus()).toBe(false);
  });
});
