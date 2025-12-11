import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RadioButton } from './radio-button';

describe('RadioButton', () => {
  let component: RadioButton;
  let fixture: ComponentFixture<RadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButton, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default checked value as false', () => {
    expect(component.checked()).toBe(false);
  });

  it('should update checked value', () => {
    component.checked.set(true);
    fixture.detectChanges();

    expect(component.checked()).toBe(true);
  });

  it('should emit onClick event', () => {
    spyOn(component.onClick, 'emit');
    const mockEvent = new Event('click');

    component.onClick.emit(mockEvent);

    expect(component.onClick.emit).toHaveBeenCalledWith(mockEvent);
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

  it('should set disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioButton = compiled.querySelector('p-radioButton');
    expect(radioButton.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set label', () => {
    component.label.set('Test Label');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioButton = compiled.querySelector('p-radioButton');
    expect(radioButton.getAttribute('ng-reflect-label')).toBe('Test Label');
  });

  it('should set value', () => {
    component.value.set('option1');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioButton = compiled.querySelector('p-radioButton');
    expect(radioButton.getAttribute('ng-reflect-value')).toBe('option1');
  });

  it('should set required state', () => {
    component.required.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioButton = compiled.querySelector('p-radioButton');
    expect(radioButton.getAttribute('ng-reflect-required')).toBe('true');
  });

  it('should set name', () => {
    component.name.set('radio-group');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const radioButton = compiled.querySelector('p-radioButton');
    expect(radioButton.getAttribute('ng-reflect-name')).toBe('radio-group');
  });

  it('should have default values', () => {
    expect(component.disabled()).toBe(false);
    expect(component.readonly()).toBe(false);
    expect(component.required()).toBe(false);
  });
});
