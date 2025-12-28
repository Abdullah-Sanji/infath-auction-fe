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
import { SelectModule } from 'primeng/select';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface DropdownChangeEvent {
  originalEvent?: Event;
  value: unknown;
}

export interface DropdownFilterEvent {
  originalEvent: Event;
  filter: string;
}

@Component({
  selector: 'lib-dropdown',
  imports: [SelectModule, FormsModule, CommonModule],
  templateUrl: './dropdown.html',
  styleUrl: './dropdown.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Dropdown),
      multi: true,
    },
  ],
})
export class Dropdown implements ControlValueAccessor {
  // Two-way bindable value using model signal
  value: ModelSignal<unknown> = model<unknown>(null);

  // Input properties
  options: InputSignal<unknown[]> = input<unknown[]>([]);
  optionLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionValue: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionDisabled: InputSignal<string | undefined> = input<string | undefined>(undefined);
  placeholder: InputSignal<string> = input<string>('Select');
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  filter: InputSignal<boolean> = input<boolean>(false);
  filterBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  showClear: InputSignal<boolean> = input<boolean>(false);
  scrollHeight: InputSignal<string> = input<string>('200px');
  virtualScroll: InputSignal<boolean> = input<boolean>(false);
  virtualScrollItemSize: InputSignal<number | undefined> = input<number | undefined>(undefined);
  editable: InputSignal<boolean> = input<boolean>(false);
  maxlength: InputSignal<number | undefined> = input<number | undefined>(undefined);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabelledBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  loading: InputSignal<boolean> = input<boolean>(false);
  loadingIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  checkmark: InputSignal<boolean> = input<boolean>(false);
  invalid: InputSignal<boolean> = input<boolean>(false);
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  fluid: InputSignal<boolean> = input<boolean>(false);
  showBorder: InputSignal<boolean> = input<boolean>(true);

  // Template inputs
  itemTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  selectedItemTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  headerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  footerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  emptyTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  emptyFilterTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);

  // Output events
  onChange: OutputEmitterRef<DropdownChangeEvent> = output<DropdownChangeEvent>();
  onFocus: OutputEmitterRef<Event> = output<Event>();
  onBlur: OutputEmitterRef<Event> = output<Event>();
  onShow: OutputEmitterRef<void> = output<void>();
  onHide: OutputEmitterRef<void> = output<void>();
  onFilter: OutputEmitterRef<DropdownFilterEvent> = output<DropdownFilterEvent>();
  onClear: OutputEmitterRef<void> = output<void>();

  // ControlValueAccessor implementation
  private onChangeCallback: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Watch for value changes and notify parent
    effect(() => {
      const currentValue = this.value();
      this.onChangeCallback(currentValue);
    });
  }

  writeValue(value: unknown): void {
    this.value.set(value);
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This is handled by the disabled input signal
  }

  handleChange(event: DropdownChangeEvent): void {
    this.onChange.emit(event);
  }

  handleFocus(event: Event): void {
    this.onFocus.emit(event);
  }

  handleBlur(event: Event): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  handleShow(): void {
    this.onShow.emit();
  }

  handleHide(): void {
    this.onHide.emit();
  }

  handleFilter(event: DropdownFilterEvent): void {
    this.onFilter.emit(event);
  }

  handleClear(): void {
    this.onClear.emit();
  }
}
