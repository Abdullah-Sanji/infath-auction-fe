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
import { MultiSelectModule } from 'primeng/multiselect';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface MultiSelectChangeEvent {
  originalEvent: Event;
  value: unknown[];
  itemValue?: unknown;
}

export interface MultiSelectFilterEvent {
  originalEvent: Event;
  filter: string;
}

export interface MultiSelectSelectAllChangeEvent {
  originalEvent: Event;
  checked: boolean;
}

@Component({
  selector: 'lib-multi-select',
  imports: [MultiSelectModule, FormsModule, CommonModule],
  templateUrl: './multi-select.html',
  styleUrl: './multi-select.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiSelect),
      multi: true,
    },
  ],
})
export class MultiSelect implements ControlValueAccessor {
  // Two-way bindable value using model signal
  value: ModelSignal<unknown[]> = model<unknown[]>([]);

  // Input properties
  options: InputSignal<unknown[]> = input<unknown[]>([]);
  optionLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionValue: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionDisabled: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionGroupLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  optionGroupChildren: InputSignal<string> = input<string>('items');
  placeholder: InputSignal<string> = input<string>('Select items');
  disabled: InputSignal<boolean> = input<boolean>(false);
  readonly: InputSignal<boolean> = input<boolean>(false);
  filter: InputSignal<boolean> = input<boolean>(true);
  filterBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  filterLocale: InputSignal<string | undefined> = input<string | undefined>(undefined);
  showToggleAll: InputSignal<boolean> = input<boolean>(true);
  selectAll: InputSignal<boolean | undefined> = input<boolean | undefined>(undefined);
  showClear: InputSignal<boolean> = input<boolean>(false);
  appendTo: InputSignal<'body' | HTMLElement | undefined> = input<'body' | HTMLElement | undefined>(
    undefined
  );
  scrollHeight: InputSignal<string> = input<string>('200px');
  emptyMessage: InputSignal<string> = input<string>('No results found');
  emptyFilterMessage: InputSignal<string> = input<string>('No results found');
  virtualScroll: InputSignal<boolean> = input<boolean>(false);
  virtualScrollItemSize: InputSignal<number | undefined> = input<number | undefined>(undefined);
  group: InputSignal<boolean> = input<boolean>(false);
  maxSelectedLabels: InputSignal<number | undefined> = input<number | undefined>(3);
  selectedItemsLabel: InputSignal<string> = input<string>('{0} items selected');
  showHeader: InputSignal<boolean> = input<boolean>(true);
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  ariaLabelledBy: InputSignal<string | undefined> = input<string | undefined>(undefined);
  loading: InputSignal<boolean> = input<boolean>(false);
  loadingIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  display: InputSignal<'comma' | 'chip'> = input<'comma' | 'chip'>('comma');
  invalid: InputSignal<boolean> = input<boolean>(false);
  variant: InputSignal<'filled' | 'outlined'> = input<'filled' | 'outlined'>('outlined');
  fluid: InputSignal<boolean> = input<boolean>(false);

  // Template inputs
  itemTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  selectedItemsTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  groupTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  headerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  filterTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  footerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  emptyTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  emptyFilterTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);

  // Output events
  onChange: OutputEmitterRef<MultiSelectChangeEvent> = output<MultiSelectChangeEvent>();
  onFocus: OutputEmitterRef<unknown> = output<unknown>();
  onBlur: OutputEmitterRef<unknown> = output<unknown>();
  onShow: OutputEmitterRef<void> = output<void>();
  onHide: OutputEmitterRef<void> = output<void>();
  onFilter: OutputEmitterRef<MultiSelectFilterEvent> = output<MultiSelectFilterEvent>();
  onClear: OutputEmitterRef<void> = output<void>();
  onSelectAllChange: OutputEmitterRef<MultiSelectSelectAllChangeEvent> = output<MultiSelectSelectAllChangeEvent>();

  // ControlValueAccessor implementation
  private onChangeCallback: (value: unknown[]) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // Watch for value changes and notify parent
    effect(() => {
      const currentValue = this.value();
      this.onChangeCallback(currentValue);
    });
  }

  writeValue(value: unknown[]): void {
    this.value.set(value || []);
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // This is handled by the disabled input signal
  }

  handleChange(event: MultiSelectChangeEvent): void {
    this.onChange.emit(event);
  }

  handleFocus(event: unknown): void {
    this.onFocus.emit(event);
  }

  handleBlur(event: unknown): void {
    this.onTouched();
    this.onBlur.emit(event);
  }

  handleShow(): void {
    this.onShow.emit();
  }

  handleHide(): void {
    this.onHide.emit();
  }

  handleFilter(event: MultiSelectFilterEvent): void {
    this.onFilter.emit(event);
  }

  handleClear(): void {
    this.onClear.emit();
  }

  handleSelectAllChange(event: MultiSelectSelectAllChangeEvent): void {
    this.onSelectAllChange.emit(event);
  }
}
