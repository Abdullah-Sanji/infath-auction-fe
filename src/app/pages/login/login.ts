import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AuthService } from '@core/services/auth.service';
import { Button } from '@shared/components/ui/button/button';
import { InputText } from '@shared/components/ui/input-text/input-text';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, TranslocoPipe, Button, InputText],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslocoService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  readonly email = signal<string>('');
  readonly password = signal<string>('');
  readonly loading = signal<boolean>(false);

  readonly isEmailValid = computed(() => /\S+@\S+\.\S+/.test(this.email()));
  readonly isPasswordPresent = computed(() => this.password().length > 0);

  setEmail(v: string | number | boolean) {
    this.email.set(String(v ?? ''));
  }
  setPassword(v: string | number | boolean) {
    this.password.set(String(v ?? ''));
  }

  async submit() {
    if (!this.isEmailValid() || !this.isPasswordPresent()) {
      this.messageService.add({
        severity: 'warn',
        summary: this.translate.translate('login.validationIncomplete'),
        detail: this.translate.translate('login.validationIncompleteDetail'),
      });
      return;
    }
    this.loading.set(true);
    try {
      const ok = await this.authService.loginWithCredentials({
        Email: this.email(),
        Password: this.password(),
      });
      if (ok) {
        await this.router.navigateByUrl('/');
      } else {
        this.messageService.add({
          severity: 'error',
          summary: this.translate.translate('login.error'),
          detail: this.translate.translate('login.errorDetail'),
        });
      }
    } catch (err) {
      this.messageService.add({
        severity: 'error',
        summary: this.translate.translate('login.error'),
        detail: this.translate.translate('login.errorDetail'),
      });
    } finally {
      this.loading.set(false);
    }
  }

  async loginWithSso() {
    await this.authService.login();
  }
}
