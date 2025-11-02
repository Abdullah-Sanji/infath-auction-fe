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
import { TextareaModule } from 'primeng/textarea';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-textarea',
  imports: [TextareaModule, FormsModule, CommonModule],
  templateUrl: './textarea.html',
  styleUrl: './textarea.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Textarea),
      multi: true,
    },
  ],
})
export class Textarea implements ControlValueAccessor {
  // Two-way bindable value using model signal
  value: ModelSignal<string | null> = model<string | null>(null);

  // Input properties
  id: InputSignal<string> = input<string>('');
  name: InputSignal<string> = input<string>('');
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  placeholder: InputSignal<string> = input<string>('');
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  required: InputSignal<boolean> = input<boolean>(false);
  autoResize: InputSignal<boolean> = input<boolean>(false);
  rows: InputSignal<number> = input<number>(5);
  cols: InputSignal<number> = input<number>(20);
  maxlength: InputSignal<number | undefined> = input<number | undefined>(undefined);
  minlength: InputSignal<number | undefined> = input<number | undefined>(undefined);
  size: InputSignal<'small' | 'large' | undefined> = input<'small' | 'large' | undefined>(undefined);
  invalid: InputSignal<boolean> = input<boolean>(false);
  spellcheck: InputSignal<boolean> = input<boolean>(false);
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
  onResize: OutputEmitterRef<Event> = output<Event>();

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

  handleResize(event: Event): void {
    this.onResize.emit(event);
  }
}

