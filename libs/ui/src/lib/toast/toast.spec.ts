import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Toast } from './toast';
import { MessageService } from 'primeng/api';

describe('Toast', () => {
  let component: Toast;
  let fixture: ComponentFixture<Toast>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Toast],
      providers: [MessageService],
    }).compileComponents();

    fixture = TestBed.createComponent(Toast);
    component = fixture.componentInstance;
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message', () => {
    spyOn(messageService, 'add');
    component.showSuccess('Success', 'Operation completed');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Operation completed',
    });
  });

  it('should show error message', () => {
    spyOn(messageService, 'add');
    component.showError('Error', 'Something went wrong');
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Something went wrong',
    });
  });

  it('should clear messages', () => {
    spyOn(messageService, 'clear');
    component.clear();
    expect(messageService.clear).toHaveBeenCalled();
  });
});

