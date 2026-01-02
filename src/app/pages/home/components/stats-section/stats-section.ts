import { Component, signal } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { StatItem } from './stats-section.interface';

@Component({
  selector: 'app-stats-section',
  imports: [TranslocoModule],
  templateUrl: './stats-section.html',
  styleUrl: './stats-section.scss',
})
export class StatsSection {
  stats = signal<StatItem[]>([
    {
      icon: 'images/icons/companies.svg',
      value: '20,000',
      label: 'home.stats.participatingCompanies',
    },
    {
      icon: 'images/icons/people-green.svg',
      value: '50,343',
      label: 'home.stats.registeredUsers',
    },
    {
      icon: 'images/icons/hummer.svg',
      value: '123,204',
      label: 'home.stats.executedAuctions',
    },
  ]);
}
