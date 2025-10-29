import { Component, input, output, InputSignal, OutputEmitterRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-button',
  imports: [ButtonModule, CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  // Input properties
  label: InputSignal<string | undefined> = input<string | undefined>(undefined);
  icon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  iconPos: InputSignal<'left' | 'right' | 'top' | 'bottom'> = input<
    'left' | 'right' | 'top' | 'bottom'
  >('left');
  badge: InputSignal<string | undefined> = input<string | undefined>(undefined);
  badgeClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  badgeSeverity: InputSignal<
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | undefined
  > = input<
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | undefined
  >(undefined);
  loading: InputSignal<boolean> = input<boolean>(false);
  loadingIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  disabled: InputSignal<boolean> = input<boolean>(false);
  severity: InputSignal<
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | undefined
  > = input<
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | undefined
  >(undefined);
  raised: InputSignal<boolean> = input<boolean>(false);
  rounded: InputSignal<boolean> = input<boolean>(false);
  text: InputSignal<boolean> = input<boolean>(false);
  plain: InputSignal<boolean> = input<boolean>(false);
  outlined: InputSignal<boolean> = input<boolean>(false);
  link: InputSignal<boolean> = input<boolean>(false);
  size: InputSignal<'small' | 'large' | undefined> = input<'small' | 'large' | undefined>(
    undefined
  );
  type: InputSignal<'button' | 'submit' | 'reset'> = input<'button' | 'submit' | 'reset'>('button');
  ariaLabel: InputSignal<string | undefined> = input<string | undefined>(undefined);
  fluid: InputSignal<boolean> = input<boolean>(false);

  // Output events
  onClick: OutputEmitterRef<MouseEvent> = output<MouseEvent>();
  onFocus: OutputEmitterRef<FocusEvent> = output<FocusEvent>();
  onBlur: OutputEmitterRef<FocusEvent> = output<FocusEvent>();

  handleClick(event: MouseEvent): void {
    if (!this.disabled() && !this.loading()) {
      this.onClick.emit(event);
    }
  }

  handleFocus(event: FocusEvent): void {
    this.onFocus.emit(event);
  }

  handleBlur(event: FocusEvent): void {
    this.onBlur.emit(event);
  }
}
