import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, signal } from '@angular/core';
import { Button } from '@shared/components/ui/button/button';
import { AddFundsModal } from './add-funds-modal/add-funds-modal';
import { TranslocoPipe } from '@jsverse/transloco';


@Component({
  standalone: true,
  selector: 'app-wallet',
  imports: [CommonModule, AddFundsModal, Button, TranslocoPipe],
  templateUrl: `./wallet.html`,
  styleUrls: ['wallet.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Wallet {
  // balances (signals)
  totalBalance = signal<number>(100000);
  reservedBalance = signal<number>(100000);
  availableBalance = signal<number>(100000);

  // modal state
  isAddFundsOpen = signal<boolean>(false);
  initialAmount = '1000';
  initialMethod = 'bank';

  // sample transactions - in real app this should come from a service
  transactions = [
    {
      type: 'reserve',
      title: 'حجز إيداع للمزاد 4211',
      meta: '٣٦ أكتوبر ٢٠٢٥، الساعة ١٤:٣٥ صباحًا',
      amount: 100000,
      delta: -1,
    },
    {
      type: 'deposit',
      title: 'إضافة رصيد',
      meta: '٣٦ أكتوبر ٢٠٢٥، الساعة ١٤:٣٥ صباحًا',
      amount: 100000,
      delta: +1,
    },
    {
      type: 'deposit',
      title: 'إضافة رصيد',
      meta: '٣٦ أكتوبر ٢٠٢٥، الساعة ١٤:٣٥ صباحًا',
      amount: 100000,
      delta: +1,
    },
    {
      type: 'reserve',
      title: 'حجز إيداع للمزاد 4211',
      meta: '٣٦ أكتوبر ٢٠٢٥، الساعة ١٤:٣٥ صباحًا',
      amount: 100000,
      delta: -1,
    },
    {
      type: 'deposit',
      title: 'إضافة رصيد',
      meta: '٣٦ أكتوبر ٢٠٢٥، الساعة ١٤:٣٥ صباحًا',
      amount: 100000,
      delta: +1,
    },
  ];

  // search/filter
  query = signal<string>('');
  filteredTransactions = signal(this.transactions);

  constructor() {
    // placeholder effect if we later fetch data
    effect(() => {
      void this.totalBalance();
      void this.reservedBalance();
      void this.availableBalance();
    });
  }

  openModal() {
    this.isAddFundsOpen.set(true);
  }
  closeModal() {
    this.isAddFundsOpen.set(false);
  }

  onAddFunds(payload: { amount: string; method: string }) {
    const parsed = Number(String(payload.amount).replace(/[^0-9.-]+/g, '')) || 0;
    this.totalBalance.update((b) => b + parsed);
    this.availableBalance.update((b) => b + parsed);
    this.transactions.unshift({
      type: 'deposit',
      title: 'إضافة رصيد',
      meta: new Date().toISOString().slice(0, 10),
      amount: parsed,
      delta: +1,
    });
    this.closeModal();
  }

  onSearch(value: string) {
    this.query.set(value);
    const q = value.trim();
    if (!q) {
      this.filteredTransactions.set(this.transactions);
      return;
    }
    this.filteredTransactions.set(
      this.transactions.filter((t) =>
        `${t.title} ${t.meta}`.toLowerCase().includes(q.toLowerCase())
      )
    );
  }
}
