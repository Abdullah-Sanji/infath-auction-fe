import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast, ToastCloseEvent, ToastLifeEndEvent } from './toast';
import { MessageService } from 'primeng/api';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast]
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default position', () => {
    expect(component.position()).toBe('top-right');
  });

  it('should emit onClose event', () => {
    spyOn(component.onClose, 'emit');
    const mockEvent: ToastCloseEvent = { message: { severity: 'success', summary: 'Test', detail: 'Test message' } };

    component.onClose.emit(mockEvent);

    expect(component.onClose.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onLifeEnd event', () => {
    spyOn(component.onLifeEnd, 'emit');
    const mockEvent: ToastLifeEndEvent = { message: { severity: 'info', summary: 'Test', detail: 'Test message' } };

    component.onLifeEnd.emit(mockEvent);

    expect(component.onLifeEnd.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should show success toast', () => {
    spyOn(messageService, 'add');
    component.enableService.set(true);

    component.success('Success', 'Operation completed');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed',
      life: 3000
    });
  });

  it('should show info toast', () => {
    spyOn(messageService, 'add');
    component.enableService.set(true);

    component.info('Info', 'Information message');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'info',
      summary: 'Info',
      detail: 'Information message',
      life: 3000
    });
  });

  it('should show warn toast', () => {
    spyOn(messageService, 'add');
    component.enableService.set(true);

    component.warn('Warning', 'Warning message');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Warning message',
      life: 3000
    });
  });

  it('should show error toast', () => {
    spyOn(messageService, 'add');
    component.enableService.set(true);

    component.error('Error', 'Error message');

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Error message',
      life: 3000
    });
  });

  it('should show toast with custom life', () => {
    spyOn(messageService, 'add');
    component.enableService.set(true);

    component.success('Success', 'Message', 5000);

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Message',
      life: 5000
    });
  });

  it('should clear messages', () => {
    spyOn(messageService, 'clear');
    component.enableService.set(true);

    component.clear();

    expect(messageService.clear).toHaveBeenCalled();
  });

  it('should not call messageService when enableService is false', () => {
    spyOn(messageService, 'add');
    component.enableService.set(false);

    component.success('Success', 'Message');

    expect(messageService.add).not.toHaveBeenCalled();
  });

  it('should set position', () => {
    component.position.set('bottom-left');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const toast = compiled.querySelector('p-toast');
    expect(toast.getAttribute('ng-reflect-position')).toBe('bottom-left');
  });

  it('should have default values', () => {
    expect(component.autoZIndex()).toBe(true);
    expect(component.baseZIndex()).toBe(0);
    expect(component.preventDuplicates()).toBe(false);
    expect(component.preventOpenDuplicates()).toBe(false);
    expect(component.enableService()).toBe(true);
  });
});
