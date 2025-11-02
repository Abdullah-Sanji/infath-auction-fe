import {
  Component,
  input,
  output,
  TemplateRef,
  InputSignal,
  OutputEmitterRef,
  signal,
  effect,
  computed,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'lib-dialog',
  imports: [DialogModule, CommonModule, ButtonModule],
  templateUrl: './dialog.html',
  styleUrl: './dialog.scss',
})
export class Dialog {
  // Visible state
  visible = signal<boolean>(false);

  // Input properties
  header: InputSignal<string | undefined> = input<string | undefined>(undefined);
  draggable: InputSignal<boolean> = input<boolean>(true);
  resizable: InputSignal<boolean> = input<boolean>(true);
  position: InputSignal<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'> = input<'center' | 'top' | 'bottom' | 'left' | 'right' | 'topleft' | 'topright' | 'bottomleft' | 'bottomright'>('center');
  blockScroll: InputSignal<boolean> = input<boolean>(true);
  closeOnEscape: InputSignal<boolean> = input<boolean>(true);
  dismissableMask: InputSignal<boolean> = input<boolean>(false);
  showHeader: InputSignal<boolean> = input<boolean>(true);
  modal: InputSignal<boolean> = input<boolean>(true);
  visible_legacy: InputSignal<boolean> = input<boolean>(false);
  width: InputSignal<string | undefined> = input<string | undefined>(undefined);
  height: InputSignal<string | undefined> = input<string | undefined>(undefined);
  style: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);

  // Computed style that merges base style with width/height
  computedStyle = computed(() => {
    const baseStyle: { [klass: string]: string | number } = {};

    const widthValue = this.width();
    if (widthValue) {
      baseStyle['width'] = widthValue;
    }

    const heightValue = this.height();
    if (heightValue) {
      baseStyle['height'] = heightValue;
    }

    return Object.keys(baseStyle).length > 0 ? baseStyle : undefined;
  });
  styleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  contentStyle: InputSignal<{ [klass: string]: string | number } | undefined> = input<{ [klass: string]: string | number } | undefined>(undefined);
  contentStyleClass: InputSignal<string | undefined> = input<string | undefined>(undefined);
  maximizable: InputSignal<boolean> = input<boolean>(false);
  appendTo: InputSignal<'body' | HTMLElement | undefined> = input<'body' | HTMLElement | undefined>(undefined);
  baseZIndex: InputSignal<number> = input<number>(0);
  autoZIndex: InputSignal<boolean> = input<boolean>(true);
  focusOnShow: InputSignal<boolean> = input<boolean>(true);
  closable: InputSignal<boolean> = input<boolean>(true);
  rtl: InputSignal<boolean> = input<boolean>(false);
  breakpoints: InputSignal<{ [key: string]: string } | undefined> = input<{ [key: string]: string } | undefined>(undefined);
  minX: InputSignal<number> = input<number>(0);
  minY: InputSignal<number> = input<number>(0);
  keepInViewport: InputSignal<boolean> = input<boolean>(true);
  transitionOptions: InputSignal<string> = input<string>('150ms cubic-bezier(0, 0, 0.2, 1)');
  closeIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  maximizeIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);
  minimizeIcon: InputSignal<string | undefined> = input<string | undefined>(undefined);

  // Template inputs
  headerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);
  footerTemplate: InputSignal<TemplateRef<unknown> | undefined> = input<TemplateRef<unknown> | undefined>(undefined);

  // Output events
  onShow: OutputEmitterRef<void> = output<void>();
  onHide: OutputEmitterRef<void> = output<void>();
  onMaximize: OutputEmitterRef<unknown> = output<unknown>();
  onMinimize: OutputEmitterRef<unknown> = output<unknown>();

  constructor() {
    // Sync visible_legacy input with visible signal
    effect(() => {
      const legacyVisible = this.visible_legacy();
      if (legacyVisible !== this.visible()) {
        this.visible.set(legacyVisible);
      }
    });
  }

  open(): void {
    this.visible.set(true);
  }

  close(): void {
    this.visible.set(false);
  }

  handleShow(): void {
    this.onShow.emit();
  }

  handleHide(): void {
    this.visible.set(false);
    this.onHide.emit();
  }

  handleMaximize(event: unknown): void {
    this.onMaximize.emit(event);
  }

  handleMinimize(event: unknown): void {
    this.onMinimize.emit(event);
  }

  // Merged style that combines style input with computed width/height
  getMergedStyle(): { [klass: string]: string | number } | undefined {
    const inputStyle = this.style();
    const widthHeightStyle = this.computedStyle();

    if (!inputStyle && !widthHeightStyle) {
      return undefined;
    }

    return {
      ...(inputStyle || {}),
      ...(widthHeightStyle || {}),
    };
  }
}

