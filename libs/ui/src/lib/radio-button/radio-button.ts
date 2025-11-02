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
  computed,
} from '@angular/core';
import { RadioButtonModule } from 'primeng/radiobutton';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface RadioButtonClickEvent {
  originalEvent: Event;
  value: unknown;
}

type RadioButtonValue = string | number | boolean | null;

@Component({
  selector: 'lib-radio-button',
  imports: [RadioButtonModule, FormsModule, CommonModule],
  templateUrl: './radio-button.html',
  styleUrl: './radio-button.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButton),
      multi: true,
    },
  ],
})
export class RadioButton implements ControlValueAccessor {
  // Two-way bindable value using model signal
  // This represents the SELECTED value (used for ngModel)
  // When this matches optionValue, the radio button is checked
  value: ModelSignal<RadioButtonValue> = model<RadioButtonValue>(null);

  // Input properties
  name: InputSignal<string> = input<string>('');
  // The value THIS radio button represents (PrimeNG's value prop)
  // If not provided, defaults to the current value (for backward compatibility)
  optionValue: InputSignal<RadioButtonValue | undefined> = input<RadioButtonValue | undefined>(undefined);
  inputId: InputSignal<string | undefined> = input<string | undefined>(undefined);
  label: InputSignal<string | undefined> = input<string | undefined>(undefined);

  // Computed optionValue - use provided optionValue or fallback to value
  computedOptionValue = computed(() => {
    const providedOptionValue = this.optionValue();
    if (providedOptionValue !== undefined && providedOptionValue !== null) {
      return providedOptionValue;
    }
    // Fallback: use value as optionValue for backward compatibility
    return this.value();
  });

  // Generate a stable ID for the radio button input
  private readonly generatedId = `radio-${Math.random().toString(36).substr(2, 9)}`;

  // Computed inputId - use provided, name, or generated
  computedInputId = computed(() => {
    const providedId = this.inputId();
    if (providedId) return providedId;
    const nameValue = this.name();
    if (nameValue) return `${nameValue}-${this.generatedId}`;
    return this.generatedId;
  });
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  required: InputSignal<boolean> = input<boolean>(false);
  tabindex: InputSignal<number | undefined> = input<number | undefined>(undefined);
  inputStyle: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);
  inputStyleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  style: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);
  styleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  invalid: InputSignal<boolean> = input<boolean>(false);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabelledBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaDescribedBy: InputSignal<string | undefined> = input<string | undefined>(undefined);

  // Output events
  onClick: OutputEmitterRef<RadioButtonClickEvent> = output<RadioButtonClickEvent>();
  onFocus: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onBlur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();

  // ControlValueAccessor implementation
  private onChangeCallback: (value: RadioButtonValue) => void = () => {
    // Called by Angular forms when value changes externally
  };
  private onTouched: () => void = () => {
    // Called by Angular forms when control is touched
  };

  constructor() {
    // Watch for value changes and notify parent
    effect(() => {
      const currentValue = this.value();
      this.onChangeCallback(currentValue);
    });
  }

  writeValue(value: RadioButtonValue | undefined): void {
    this.value.set(value ?? null);
  }

  registerOnChange(fn: (value: RadioButtonValue) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(_isDisabled: boolean): void {
    // This is handled by the disabled input signal
    // The parameter is required by ControlValueAccessor interface
    void _isDisabled; // Mark as intentionally unused
  }

  handleClick(event: RadioButtonClickEvent): void {
    this.onClick.emit(event);
  }

  handleFocus(event: Event): void {
    // PrimeNG emits Event, but we need to ensure it's FocusEvent
    const focusEvent = event as FocusEvent;
    this.onFocus.emit(focusEvent);
  }

  handleBlur(event: Event): void {
    // PrimeNG emits Event, but we need to ensure it's FocusEvent
    const focusEvent = event as FocusEvent;
    this.onTouched();
    this.onBlur.emit(focusEvent);
  }
}

