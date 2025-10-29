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
} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-input-text',
  imports: [InputTextModule, FormsModule, CommonModule],
  templateUrl: './input-text.html',
  styleUrl: './input-text.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputText),
      multi: true,
    },
  ],
})
export class InputText implements ControlValueAccessor {
  // Two-way bindable value using model signal
  value: ModelSignal<string | null> = model<string | null>(null);

  // Input properties
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  placeholder: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  maxlength: InputSignal<number | undefined> = input<number | undefined>(undefined);
  size: InputSignal<'small' | 'large' | undefined> = input<'small' | 'large' | undefined>(
    undefined
  );
  invalid: InputSignal<boolean> = input<boolean>(false);
  type: InputSignal<string> = input<string>('text');
  autocomplete: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabelledBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaDescribedBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  fluid: InputSignal<boolean> = input<boolean>(false);

  // Output events
  onInput: OutputEmitterRef<Event> = output<Event>();
  onBlur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onFocus: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onKeyDown: OutputEmitterRef<KeyboardEvent> = output<KeyboardEvent>();
  onKeyUp: OutputEmitterRef<KeyboardEvent> = output<KeyboardEvent>();
  onPaste: OutputEmitterRef<ClipboardEvent> = output<ClipboardEvent>();

  // ControlValueAccessor implementation
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Watch for value changes and notify parent
    effect(() => {
      const currentValue = this.value();
      this.onChange(currentValue);
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This is handled by the disabled input signal
  }

  handleInput(event: Event): void {
    this.onInput.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  handleFocus(event: FocusEvent): void {
    this.onFocus.emit(event);
  }

  handleKeyDown(event: KeyboardEvent): void {
    this.onKeyDown.emit(event);
  }

  handleKeyUp(event: KeyboardEvent): void {
    this.onKeyUp.emit(event);
  }

  handlePaste(event: ClipboardEvent): void {
    this.onPaste.emit(event);
  }
}

