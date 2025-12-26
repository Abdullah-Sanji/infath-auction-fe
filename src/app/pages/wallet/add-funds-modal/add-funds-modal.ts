import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { InputText } from '@shared/components/ui/input-text/input-text';
import { Button } from '@shared/components/ui/button/button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-add-funds-modal',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, InputText, Button],
  templateUrl: 'add-funds-modal.html',
  styleUrls: ['add-funds-modal.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddFundsModal {
  // Inputs
  readonly open = input<boolean>(true);
  readonly initialAmount = input<string>('1000');
  readonly initialMethod = input<string>('bank');
  readonly loading = input<boolean>(false);

  // Internal state signals
  readonly amountValue = signal<string>(this.initialAmount());
  readonly methodValue = signal<string>(this.initialMethod());

  // Outputs
  readonly confirm = output<{ amount: string; method: string }>();
  readonly cancel = output<void>();

  // Derived disabled state for primary action
  readonly canSubmit = computed(() => {
    const amount = this.amountValue().trim();
    return !!amount && !this.loading();
  });

  private readonly syncInitial = effect(() => {
    this.amountValue.set(this.initialAmount());
    this.methodValue.set(this.initialMethod());
  });

  onAmountChange(v: string | number | boolean) {
    this.amountValue.set(String(v));
  }
  onMethodChange(v: string | number | boolean) {
    this.methodValue.set(String(v));
  }
  submit() {
    if (!this.canSubmit()) return;
    this.confirm.emit({ amount: this.amountValue(), method: this.methodValue() });
  }
  close() {
    this.cancel.emit();
  }
}
