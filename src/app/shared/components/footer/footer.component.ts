import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslocoPipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  get currentYear(): number {
    return new Date().getFullYear();
  }
  get links(): FooterLink[] {
    var arr = [
      { url: 'https://infath.gov.sa/', title: 'Infath' },
      { url: 'https://Azm.sa/', title: 'AZM' },
    ];
    return arr;
  }
}

interface FooterLink {
  url: string;
  title: string;
}
