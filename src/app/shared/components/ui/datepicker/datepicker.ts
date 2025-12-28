import {
  Component,
  input,
  output,
  model,
  forwardRef,
  InputSignal,
  OutputEmitterRef,
  ModelSignal,
  effect,
  TemplateRef,
} from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DatepickerChangeEvent {
  originalEvent?: Event;
  value: Date | Date[] | string | string[] | null;
}

export interface DatepickerSelectEvent {
  originalEvent?: Event;
  value: Date | Date[] | string | string[] | null;
}

export interface DatepickerClearEvent {
  originalEvent?: Event;
}

export interface DatepickerMonthChangeEvent {
  month: number;
  year: number;
}

export interface DatepickerYearChangeEvent {
  month: number;
  year: number;
}

@Component({
  selector: 'lib-datepicker',
  imports: [DatePickerModule, FormsModule, CommonModule],
  templateUrl: './datepicker.html',
  styleUrl: './datepicker.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Datepicker),
      multi: true,
    },
  ],
})
export class Datepicker implements ControlValueAccessor {
  // Two-way bindable value using model signal
  value: ModelSignal<Date | Date[] | string | string[] | null> = model<Date | Date[] | string | string[] | null>(null);

  // Input properties - Basic
  selectionMode: InputSignal<'single' | 'multiple' | 'range'> = input<'single' | 'multiple' | 'range'>('single');
  dateFormat: InputSignal<string> = input<string>('mm/dd/yy');
  placeholder: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonlyInput: InputSignal<boolean> = input<boolean>(false);
  showIcon: InputSignal<boolean> = input<boolean>(true);
  iconDisplay: InputSignal<'input' | 'button'> = input<'input' | 'button'>('input');
  showOnFocus: InputSignal<boolean> = input<boolean>(true);
  showButtonBar: InputSignal<boolean> = input<boolean>(false);
  showClear: InputSignal<boolean> = input<boolean>(false);
  keepInvalid: InputSignal<boolean> = input<boolean>(false);
  hideOnDateTimeSelect: InputSignal<boolean> = input<boolean>(false);

  // Date/Time constraints
  minDate: InputSignal<Date | undefined> = input<Date | undefined>(undefined);
  maxDate: InputSignal<Date | undefined> = input<Date | undefined>(undefined);
  disabledDates: InputSignal<Date[] | undefined> = input<Date[] | undefined>(undefined);
  disabledDays: InputSignal<number[] | undefined> = input<number[] | undefined>(undefined);
  defaultDate: InputSignal<Date | undefined> = input<Date | undefined>(undefined);

  // Time selection
  showTime: InputSignal<boolean> = input<boolean>(false);
  timeOnly: InputSignal<boolean> = input<boolean>(false);
  hourFormat: InputSignal<'12' | '24'> = input<'12' | '24'>('24');
  stepHour: InputSignal<number> = input<number>(1);
  stepMinute: InputSignal<number> = input<number>(1);
  stepSecond: InputSignal<number> = input<number>(1);
  showSeconds: InputSignal<boolean> = input<boolean>(false);
  numberOfMonths: InputSignal<number> = input<number>(1);
  view: InputSignal<'date' | 'month' | 'year'> = input<'date' | 'month' | 'year'>('date');
  firstDayOfWeek: InputSignal<number> = input<number>(0);
  showWeek: InputSignal<boolean> = input<boolean>(false);
  showOtherMonths: InputSignal<boolean> = input<boolean>(true);
  selectOtherMonths: InputSignal<boolean> = input<boolean>(false);

  // Display
  inline: InputSignal<boolean> = input<boolean>(false);
  touchUI: InputSignal<boolean> = input<boolean>(false);
  multipleSeparator: InputSignal<string> = input<string>(',');
  rangeSeparator: InputSignal<string> = input<string>('-');

  // Styling
  style: InputSignal<Record<string, unknown> | undefined> = input<Record<string, unknown> | undefined>(undefined);
  styleClass: InputSignal<string> = input<string>('');
  inputStyle: InputSignal<Record<string, unknown> | undefined> = input<Record<string, unknown> | undefined>(undefined);
  inputStyleClass: InputSignal<string> = input<string>('');
  panelStyle: InputSignal<Record<string, unknown> | undefined> = input<Record<string, unknown> | undefined>(undefined);
  panelStyleClass: InputSignal<string> = input<string>('');
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  fluid: InputSignal<boolean> = input<boolean>(false);
  invalid: InputSignal<boolean> = input<boolean>(false);
  showBorder: InputSignal<boolean> = input<boolean>(true);
  // Positioning
  appendTo: InputSignal<string | HTMLElement | undefined> = input<string | HTMLElement | undefined>(undefined);
  baseZIndex: InputSignal<number> = input<number>(0);
  autoZIndex: InputSignal<boolean> = input<boolean>(true);
  focusTrap: InputSignal<boolean> = input<boolean>(true);

  // Localization
  shortYearCutoff: InputSignal<string> = input<string>('+10');

  // Accessibility
  ariaLabel: InputSignal<string> = input<string>('');
  ariaLabelledBy: InputSignal<string> = input<string>('');
  ariaDescribedBy: InputSignal<string> = input<string>('');
  ariaRequired: InputSignal<boolean> = input<boolean>(false);
  ariaInvalid: InputSignal<boolean> = input<boolean>(false);

  // Template inputs
  iconTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  headerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  footerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  dateTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  decadeTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  monthTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  yearTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);

  // Output events
  onChange: OutputEmitterRef<DatepickerChangeEvent> = output<DatepickerChangeEvent>();
  onSelect: OutputEmitterRef<DatepickerSelectEvent> = output<DatepickerSelectEvent>();
  onClear: OutputEmitterRef<DatepickerClearEvent> = output<DatepickerClearEvent>();
  onFocus: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onBlur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onShow: OutputEmitterRef<void> = output<void>();
  onHide: OutputEmitterRef<void> = output<void>();
  onMonthChange: OutputEmitterRef<DatepickerMonthChangeEvent> = output<DatepickerMonthChangeEvent>();
  onYearChange: OutputEmitterRef<DatepickerYearChangeEvent> = output<DatepickerYearChangeEvent>();
  onTodayClick: OutputEmitterRef<Event> = output<Event>();
  onClearClick: OutputEmitterRef<Event> = output<Event>();

  // ControlValueAccessor implementation
  private onChangeCallback: (value: Date | Date[] | string | string[] | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Watch for value changes and notify parent
    effect(() => {
      const currentValue = this.value();
      this.onChangeCallback(currentValue);
    });
  }

  writeValue(value: Date | Date[] | string | string[] | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: Date | Date[] | string | string[] | null) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This is handled by the disabled input signal
  }

  handleChange(event: unknown): void {
    this.onChange.emit(event as DatepickerChangeEvent);
  }

  handleSelect(event: unknown): void {
    this.onSelect.emit(event as DatepickerSelectEvent);
  }

  handleClear(event: unknown): void {
    this.onClear.emit(event as DatepickerClearEvent);
  }

  handleFocus(event: unknown): void {
    this.onFocus.emit(event as FocusEvent);
  }

  handleBlur(event: unknown): void {
    this.onTouched();
    this.onBlur.emit(event as FocusEvent);
  }

  handleShow(): void {
    this.onShow.emit();
  }

  handleHide(): void {
    this.onHide.emit();
  }

  handleMonthChange(event: unknown): void {
    this.onMonthChange.emit(event as DatepickerMonthChangeEvent);
  }

  handleYearChange(event: unknown): void {
    this.onYearChange.emit(event as DatepickerYearChangeEvent);
  }

  handleTodayClick(event: unknown): void {
    this.onTodayClick.emit(event as Event);
  }

  handleClearClick(event: unknown): void {
    this.onClearClick.emit(event as Event);
  }
}

