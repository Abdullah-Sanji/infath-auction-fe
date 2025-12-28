import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Datepicker, DatepickerChangeEvent, DatepickerSelectEvent, DatepickerClearEvent, DatepickerMonthChangeEvent, DatepickerYearChangeEvent } from './datepicker';

describe('Datepicker', () => {
  let component: Datepicker;
  let fixture: ComponentFixture<Datepicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Datepicker, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Datepicker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default value as null', () => {
    expect(component.value()).toBeNull();
  });

  it('should update value', () => {
    const testDate = new Date(2025, 0, 15);
    component.value.set(testDate);
    fixture.detectChanges();

    expect(component.value()).toEqual(testDate);
  });

  it('should emit onChange event', () => {
    spyOn(component.onChange, 'emit');
    const mockEvent: DatepickerChangeEvent = {
      originalEvent: new Event('change'),
      value: new Date(2025, 0, 15)
    };

    component.handleChange(mockEvent);

    expect(component.onChange.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onSelect event', () => {
    spyOn(component.onSelect, 'emit');
    const mockEvent: DatepickerSelectEvent = {
      originalEvent: new Event('select'),
      value: new Date(2025, 0, 15)
    };

    component.handleSelect(mockEvent);

    expect(component.onSelect.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onClear event', () => {
    spyOn(component.onClear, 'emit');
    const mockEvent: DatepickerClearEvent = {
      originalEvent: new Event('clear')
    };

    component.handleClear(mockEvent);

    expect(component.onClear.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onFocus event', () => {
    spyOn(component.onFocus, 'emit');
    const mockEvent = new FocusEvent('focus');

    component.handleFocus(mockEvent);

    expect(component.onFocus.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onBlur event', () => {
    spyOn(component.onBlur, 'emit');
    const mockEvent = new FocusEvent('blur');

    component.handleBlur(mockEvent);

    expect(component.onBlur.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onShow event', () => {
    spyOn(component.onShow, 'emit');

    component.handleShow();

    expect(component.onShow.emit).toHaveBeenCalled();
  });

  it('should emit onHide event', () => {
    spyOn(component.onHide, 'emit');

    component.handleHide();

    expect(component.onHide.emit).toHaveBeenCalled();
  });

  it('should emit onMonthChange event', () => {
    spyOn(component.onMonthChange, 'emit');
    const mockEvent: DatepickerMonthChangeEvent = {
      month: 5,
      year: 2025
    };

    component.handleMonthChange(mockEvent);

    expect(component.onMonthChange.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onYearChange event', () => {
    spyOn(component.onYearChange, 'emit');
    const mockEvent: DatepickerYearChangeEvent = {
      month: 5,
      year: 2025
    };

    component.handleYearChange(mockEvent);

    expect(component.onYearChange.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onTodayClick event', () => {
    spyOn(component.onTodayClick, 'emit');
    const mockEvent = new Event('todayClick');

    component.handleTodayClick(mockEvent);

    expect(component.onTodayClick.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onClearClick event', () => {
    spyOn(component.onClearClick, 'emit');
    const mockEvent = new Event('clearClick');

    component.handleClearClick(mockEvent);

    expect(component.onClearClick.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should set disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set placeholder', () => {
    component.placeholder.set('Select date');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-placeholder')).toBe('Select date');
  });

  it('should set dateFormat', () => {
    component.dateFormat.set('dd/mm/yy');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-date-format')).toBe('dd/mm/yy');
  });

  it('should set selectionMode', () => {
    component.selectionMode.set('range');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-selection-mode')).toBe('range');
  });

  it('should set showTime', () => {
    component.showTime.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-show-time')).toBe('true');
  });

  it('should set showIcon', () => {
    component.showIcon.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-show-icon')).toBe('true');
  });

  it('should set minDate', () => {
    const minDate = new Date(2025, 0, 1);
    component.minDate.set(minDate);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-min-date')).toBeTruthy();
  });

  it('should set maxDate', () => {
    const maxDate = new Date(2025, 11, 31);
    component.maxDate.set(maxDate);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-max-date')).toBeTruthy();
  });

  it('should set variant', () => {
    component.variant.set('filled');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-variant')).toBe('filled');
  });

  it('should set invalid state', () => {
    component.invalid.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-invalid')).toBe('true');
  });

  it('should set fluid state', () => {
    component.fluid.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-fluid')).toBe('true');
  });

  it('should implement ControlValueAccessor writeValue', () => {
    const testDate = new Date(2025, 0, 15);
    component.writeValue(testDate);

    expect(component.value()).toEqual(testDate);
  });

  it('should implement ControlValueAccessor registerOnChange', () => {
    const mockFn = jasmine.createSpy('onChange');
    component.registerOnChange(mockFn);

    component.value.set(new Date(2025, 0, 15));
    fixture.detectChanges();

    expect(mockFn).toHaveBeenCalled();
  });

  it('should implement ControlValueAccessor registerOnTouched', () => {
    const mockFn = jasmine.createSpy('onTouched');
    component.registerOnTouched(mockFn);

    component.handleBlur(new FocusEvent('blur'));

    expect(mockFn).toHaveBeenCalled();
  });

  it('should have default values', () => {
    expect(component.selectionMode()).toBe('single');
    expect(component.dateFormat()).toBe('mm/dd/yy');
    expect(component.disabled()).toBe(false);
    expect(component.readonlyInput()).toBe(false);
    expect(component.showIcon()).toBe(true);
    expect(component.iconDisplay()).toBe('input');
    expect(component.showOnFocus()).toBe(true);
    expect(component.showButtonBar()).toBe(false);
    expect(component.showClear()).toBe(false);
    expect(component.manualInput()).toBe(true);
    expect(component.keepInvalid()).toBe(false);
    expect(component.hideOnDateTimeSelect()).toBe(false);
    expect(component.showTime()).toBe(false);
    expect(component.timeOnly()).toBe(false);
    expect(component.hourFormat()).toBe('24');
    expect(component.monthNavigator()).toBe(false);
    expect(component.yearNavigator()).toBe(false);
    expect(component.numberOfMonths()).toBe(1);
    expect(component.view()).toBe('date');
    expect(component.firstDayOfWeek()).toBe(0);
    expect(component.showWeek()).toBe(false);
    expect(component.inline()).toBe(false);
    expect(component.touchUI()).toBe(false);
    expect(component.variant()).toBe('outlined');
    expect(component.fluid()).toBe(false);
    expect(component.invalid()).toBe(false);
    expect(component.autoZIndex()).toBe(true);
    expect(component.focusTrap()).toBe(true);
  });

  it('should handle multiple selection mode', () => {
    component.selectionMode.set('multiple');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-selection-mode')).toBe('multiple');
  });

  it('should handle range selection mode', () => {
    component.selectionMode.set('range');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-selection-mode')).toBe('range');
  });

  it('should handle timeOnly mode', () => {
    component.timeOnly.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-time-only')).toBe('true');
  });

  it('should handle inline mode', () => {
    component.inline.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-inline')).toBe('true');
  });

  it('should handle touchUI mode', () => {
    component.touchUI.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-touch-ui')).toBe('true');
  });

  it('should handle disabledDates', () => {
    const disabledDates = [new Date(2025, 0, 1), new Date(2025, 0, 2)];
    component.disabledDates.set(disabledDates);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-disabled-dates')).toBeTruthy();
  });

  it('should handle disabledDays', () => {
    const disabledDays = [0, 6]; // Sunday and Saturday
    component.disabledDays.set(disabledDays);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const datepicker = compiled.querySelector('p-datepicker');
    expect(datepicker.getAttribute('ng-reflect-disabled-days')).toBeTruthy();
  });
});

