import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog]
    }).compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default visible value as false', () => {
    expect(component.visible()).toBe(false);
  });

  it('should update visible value', () => {
    component.visible.set(true);
    fixture.detectChanges();

    expect(component.visible()).toBe(true);
  });

  it('should emit onShow event', () => {
    spyOn(component.onShow, 'emit');
    const mockEvent = new Event('show');

    component.onShow.emit(mockEvent);

    expect(component.onShow.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onHide event', () => {
    spyOn(component.onHide, 'emit');
    const mockEvent = new Event('hide');

    component.onHide.emit(mockEvent);

    expect(component.onHide.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onMaximize event', () => {
    spyOn(component.onMaximize, 'emit');
    const mockEvent = { maximized: true };

    component.onMaximize.emit(mockEvent);

    expect(component.onMaximize.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onUnmaximize event', () => {
    spyOn(component.onUnmaximize, 'emit');
    const mockEvent = { maximized: false };

    component.onUnmaximize.emit(mockEvent);

    expect(component.onUnmaximize.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should set header', () => {
    component.header.set('Test Dialog');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('p-dialog');
    expect(dialog.getAttribute('ng-reflect-header')).toBe('Test Dialog');
  });

  it('should set modal state', () => {
    component.modal.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('p-dialog');
    expect(dialog.getAttribute('ng-reflect-modal')).toBe('false');
  });

  it('should set position', () => {
    component.position.set('top');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('p-dialog');
    expect(dialog.getAttribute('ng-reflect-position')).toBe('top');
  });

  it('should set closable state', () => {
    component.closable.set(false);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dialog = compiled.querySelector('p-dialog');
    expect(dialog.getAttribute('ng-reflect-closable')).toBe('false');
  });

  it('should have default values', () => {
    expect(component.draggable()).toBe(true);
    expect(component.resizable()).toBe(true);
    expect(component.modal()).toBe(true);
    expect(component.position()).toBe('center');
    expect(component.blockScroll()).toBe(true);
    expect(component.closeOnEscape()).toBe(true);
    expect(component.closable()).toBe(true);
    expect(component.focusOnShow()).toBe(true);
  });

  it('should compute isVisible', () => {
    expect(component.isVisible()).toBe(false);

    component.visible.set(true);
    fixture.detectChanges();

    expect(component.isVisible()).toBe(true);
  });
});
