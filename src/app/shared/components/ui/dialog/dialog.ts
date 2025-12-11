import { Component, input, output, model, computed } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';

export type DialogPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright';

export interface DialogMaximizeEvent {
  maximized: boolean;
}

@Component({
  selector: 'app-dialog',
  imports: [DialogModule, CommonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss'
})
export class Dialog {
  // Model for two-way binding
  visible = model<boolean>(false);

  // Inputs
  header = input<string>();
  draggable = input<boolean>(true);
  resizable = input<boolean>(true);
  modal = input<boolean>(true);
  position = input<DialogPosition>('center');
  blockScroll = input<boolean>(true);
  closeOnEscape = input<boolean>(true);
  dismissableMask = input<boolean>(false);
  closable = input<boolean>(true);
  maximizable = input<boolean>(false);
  focusOnShow = input<boolean>(true);
  appendTo = input<string | HTMLElement>();
  style = input<Record<string, string>>();
  styleClass = input<string>();
  contentStyle = input<Record<string, string>>();
  contentStyleClass = input<string>();
  rtl = input<boolean>(false);
  breakpoints = input<Record<string, string>>();
  baseZIndex = input<number>(0);
  autoZIndex = input<boolean>(true);
  transitionOptions = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
  showHeader = input<boolean>(true);

  // Outputs
  onShow = output<Event>();
  onHide = output<Event>();
  onMaximize = output<any>();
  onUnmaximize = output<any>();
  onDragEnd = output<Event>();
  onResizeInit = output<Event>();
  onResizeEnd = output<Event>();

  // Computed
  isVisible = computed(() => this.visible());
}
