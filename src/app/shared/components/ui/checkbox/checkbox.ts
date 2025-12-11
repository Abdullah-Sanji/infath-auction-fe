import {
  Component,
  input,
  output,
  model,
  forwardRef,
  InputSignal,
  OutputEmitterRef,
  ModelSignal,
  computed,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface CheckboxChangeEvent {
  checked?: boolean;
  originalEvent?: Event;
}

type CheckboxValue = boolean | string | number | null;
type CheckboxValueArray = CheckboxValue[];
type CheckboxValueType = CheckboxValue | CheckboxValueArray;

@Component({
  selector: 'lib-checkbox',
  imports: [CheckboxModule, FormsModule, CommonModule],
  templateUrl: './checkbox.html',
  styleUrl: './checkbox.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Checkbox),
      multi: true,
    },
  ],
})
export class Checkbox {
  // Two-way bindable value using model signal
  // When binary=true: CheckboxValue (boolean | string | number | null)
  // When binary=false: CheckboxValueArray (array of selected values)
  value: ModelSignal<CheckboxValueType> = model<CheckboxValueType>(null);

  // Input properties
  name: InputSignal<string> = input<string>('');
  label: InputSignal<string | undefined> = input<string | undefined>(undefined);
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  required: InputSignal<boolean> = input<boolean>(false);
  binary: InputSignal<boolean> = input<boolean>(false);
  trueValue: InputSignal<CheckboxValue> = input<CheckboxValue>(true);
  falseValue: InputSignal<CheckboxValue> = input<CheckboxValue>(false);
  inputId: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabelledBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaDescribedBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  tabindex: InputSignal<number | undefined> = input<number | undefined>(undefined);
  inputStyle: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);
  inputStyleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  style: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);
  styleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  size: InputSignal<'small' | 'large' | undefined> = input<'small' | 'large' | undefined>(undefined);
  invalid: InputSignal<boolean> = input<boolean>(false);
  checked: Signal<boolean> = signal<boolean>(false);
  // Generate a stable ID for the checkbox input
  private readonly generatedId = `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Computed inputId - use provided, name, or generated
  computedInputId = computed(() => {
    const providedId = this.inputId();
    if (providedId) return providedId;
    const nameValue = this.name();
    if (nameValue) return nameValue;
    return this.generatedId;
  });

  // Writable signal for PrimeNG checkbox binding
  // This syncs with the value signal but ensures correct format for PrimeNG
  checkboxValue: WritableSignal<boolean> = signal<boolean>(false);

  // Output events
  onChange: OutputEmitterRef<CheckboxChangeEvent> = output<CheckboxChangeEvent>();
  onFocus: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onBlur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();


  writeValue(value: CheckboxValueType | undefined): void {
    if (value === null || value === undefined) {
      // Set appropriate default based on binary mode
      this.value.set(this.binary() ? null : []);
    } else if (this.binary()) {
      // Binary mode: use the value as-is (it can be boolean, string, number, etc.)
      this.value.set(value as CheckboxValue);
    } else {
      // Non-binary mode: ensure array
      // If value is boolean true, convert to array with trueValue
      // If value is boolean false, use empty array
      // If value is already an array, use it
      if (Array.isArray(value)) {
        this.value.set(value);
      } else if (value === true || value === this.trueValue()) {
        // If value is true or matches trueValue, include trueValue in array
        this.value.set([this.trueValue()]);
      } else {
        // Otherwise, empty array (unchecked)
        this.value.set([]);
      }
    }
    // checkboxValue will be updated by the effect watching value()
  }

  setDisabledState(_isDisabled: boolean): void {
    // This is handled by the disabled input signal
    // The parameter is required by ControlValueAccessor interface
    void _isDisabled; // Mark as intentionally unused
  }

  handleChange(event: CheckboxChangeEvent): void {
    // Update internal value from PrimeNG checkbox event
    if (event && typeof event === 'object' && 'checked' in event) {
      const checked = event.checked;
      if (this.binary()) {
        // Binary mode: set boolean value
        this.value.set(checked ? this.trueValue() : this.falseValue());
      } else {
        // Non-binary mode: update array
        const valueFromSignal = this.value();
        const currentValue = Array.isArray(valueFromSignal) ? [...valueFromSignal] : [];
        const valueToToggle = this.trueValue();

        if (checked) {
          // Add to array if not already present
          if (!currentValue.includes(valueToToggle)) {
            currentValue.push(valueToToggle);
          }
        } else {
          // Remove from array
          const index = currentValue.indexOf(valueToToggle);
          if (index > -1) {
            currentValue.splice(index, 1);
          }
        }
        this.value.set(currentValue);
      }
    }
    this.onChange.emit(event);
  }

  handleFocus(event: Event): void {
    // PrimeNG emits Event, but we need to ensure it's FocusEvent
    const focusEvent = event as FocusEvent;
    this.onFocus.emit(focusEvent);
  }

  handleBlur(event: Event): void {
    // PrimeNG emits Event, but we need to ensure it's FocusEvent
    const focusEvent = event as FocusEvent;
    this.onBlur.emit(focusEvent);
  }
}
