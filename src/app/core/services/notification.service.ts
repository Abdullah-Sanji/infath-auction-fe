import { environment } from '../../../environments/environment';
import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  config = {
    timeOut: environment.notificationDuration,
    showProgressBar: true,
    pauseOnHover: true,
    clickToClose: true,
    maxLength: 3,
    preventDuplicates: true,
  };
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslocoService);

  success(message: string) {
    this.messageService.add({
      severity: 'success',
      summary: '',
      detail: message,
      life: this.config.timeOut,
    });
  }

  error(message: string) {
    this.messageService.add({
      severity: 'error',
      summary: '',
      detail: message,
      life: this.config.timeOut,
    });
  }

  info(message: string) {
    this.messageService.add({
      severity: 'info',
      summary: '',
      detail: message,
      life: this.config.timeOut,
    });
  }

  warn(message: string) {
    this.messageService.add({
      severity: 'warn',
      summary: '',
      detail: message,
      life: this.config.timeOut,
    });
  }

  /** show general error toast */
  generalError(): void {
    this.messageService.add({
      severity: 'error',
      summary: '',
      detail: this.translateService.translate('shared.general-error'),
      life: this.config.timeOut,
    });
  }
}
