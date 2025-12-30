import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslocoService);

  success(message: string) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'success',
        summary: '',
        detail: message,
        life: environment.notificationDuration,
      });
    }, 500);
  }

  error(message: string) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: '',
        detail: message,
        life: environment.notificationDuration,
      });
    }, 500);
  }

  info(message: string) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'info',
        summary: '',
        detail: message,
        life: environment.notificationDuration,
      });
    }, 500);
  }

  warn(message: string) {
    setTimeout(() => {
      this.messageService.add({
        severity: 'warn',
        summary: '',
        detail: message,
        life: environment.notificationDuration,
      });
    }, 500);
  }

  /** show general error toast */
  generalError(): void {
    setTimeout(() => {
      this.messageService.add({
        severity: 'error',
        summary: '',
        detail: this.translateService.translate('shared.general-error'),
        life: environment.notificationDuration,
      });
    }, 500);
  }
}
