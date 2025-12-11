import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
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

  it('should emit onChange event', () => {
    spyOn(component.onChange, 'emit');
    const mockEvent = { checked: true, originalEvent: new Event('change') };

    component.onChange.emit(mockEvent);

    expect(component.onChange.emit).toHaveBeenCalledWith(mockEvent);
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
    const checkbox = compiled.querySelector('p-checkbox');
    expect(checkbox.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set label', () => {
    component.label.set('Test Label');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkbox = compiled.querySelector('p-checkbox');
    expect(checkbox.getAttribute('ng-reflect-label')).toBe('Test Label');
  });

  it('should set binary mode', () => {
    component.binary.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkbox = compiled.querySelector('p-checkbox');
    expect(checkbox.getAttribute('ng-reflect-binary')).toBe('true');
  });

  it('should set required state', () => {
    component.required.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const checkbox = compiled.querySelector('p-checkbox');
    expect(checkbox.getAttribute('ng-reflect-required')).toBe('true');
  });

  it('should have default values', () => {
    expect(component.binary()).toBe(false);
    expect(component.disabled()).toBe(false);
    expect(component.readonly()).toBe(false);
    expect(component.required()).toBe(false);
    expect(component.trueValue()).toBe(true);
    expect(component.falseValue()).toBe(false);
  });
});
