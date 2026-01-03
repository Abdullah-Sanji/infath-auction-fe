import { Component, inject } from '@angular/core';
import { TranslocoModule } from '@jsverse/transloco';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cta-section',
  imports: [TranslocoModule],
  templateUrl: './cta-section.html',
  styleUrl: './cta-section.scss',
})
export class CtaSection {
  private router = inject(Router);

  onLoginClick(): void {
    this.router.navigate(['/login']);
  }
}
