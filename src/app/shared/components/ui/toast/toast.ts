import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-toast',
  imports: [ToastModule, CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  providers: [MessageService],
})
export class Toast implements OnInit, OnDestroy {
  private messageService = inject(MessageService);

  // Position settings
  position = signal<'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center'>('top-right');

  // Key for this toast instance
  key = signal<string | undefined>(undefined);

  // Auto clear settings
  autoZIndex = signal<boolean>(true);
  baseZIndex = signal<number>(0);
  escapeKey = signal<boolean>(true);
  showTransformOptions = signal<string>('translateY(100%)');
  hideTransformOptions = signal<string>('translateY(-100%)');
  showTransitionOptions = signal<string>('300ms ease-out');
  hideTransitionOptions = signal<string>('250ms ease-in');
  breakpoints = signal<{ [key: string]: any } | undefined>(undefined);
  style = signal<{ [klass: string]: any } | undefined>(undefined);
  styleClass = signal<string | undefined>(undefined);
  preventOpenDuplicates = signal<boolean>(false);
  preventDuplicates = signal<boolean>(false);
  showCloseIcon = signal<boolean>(true);
  showLife = signal<boolean>(true);
  life = signal<number>(3000);
  sticky = signal<boolean>(false);
  closeIcon = signal<string | undefined>(undefined);


  ngOnInit(): void {
    // Toast is ready
  }

  ngOnDestroy(): void {
    this.messageService.clear();
  }

  // Convenience methods
  showSuccess(summary: string, detail?: string): void {
    this.messageService.add({ severity: 'success', summary, detail });
  }

  showInfo(summary: string, detail?: string): void {
    this.messageService.add({ severity: 'info', summary, detail });
  }

  showWarn(summary: string, detail?: string): void {
    this.messageService.add({ severity: 'warn', summary, detail });
  }

  showError(summary: string, detail?: string): void {
    this.messageService.add({ severity: 'error', summary, detail });
  }

  clear(): void {
    this.messageService.clear();
  }
}
