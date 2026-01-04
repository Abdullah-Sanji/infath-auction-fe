import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatMessages } from './chat-messages';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { ChatMessage, ChatConversation } from '../../../../pages/chat/interfaces/chat.interface';

describe('ChatMessages', () => {
  let component: ChatMessages;
  let fixture: ComponentFixture<ChatMessages>;

  beforeEach(async () => {
    const mockTranslocoService = jasmine.createSpyObj('TranslocoService', [
      'selectTranslate',
      'translate'
    ]);
    mockTranslocoService.selectTranslate.and.returnValue(of(''));

    await TestBed.configureTestingModule({
      imports: [ChatMessages],
      providers: [{ provide: TranslocoService, useValue: mockTranslocoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatMessages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit message when send button is clicked', () => {
    spyOn(component.messageSent, 'emit');

    component.messageText.set('Test message');
    component.sendMessage();

    expect(component.messageSent.emit).toHaveBeenCalledWith('Test message');
    expect(component.messageText()).toBe('');
  });

  it('should not send empty messages', () => {
    spyOn(component.messageSent, 'emit');

    component.messageText.set('   ');
    component.sendMessage();

    expect(component.messageSent.emit).not.toHaveBeenCalled();
  });

  it('should send message on Enter key', () => {
    spyOn(component, 'sendMessage');

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(event);

    expect(component.sendMessage).toHaveBeenCalled();
  });

  it('should not send message on Shift+Enter', () => {
    spyOn(component, 'sendMessage');

    const event = new KeyboardEvent('keydown', { key: 'Enter', shiftKey: true });
    component.onKeyDown(event);

    expect(component.sendMessage).not.toHaveBeenCalled();
  });

  it('should format message time correctly', () => {
    const testDate = new Date('2025-01-23T15:30:00');
    const formatted = component.formatMessageTime(testDate);
    expect(formatted).toBe('15:30');
  });

  it('should display messages when conversation is selected', () => {
    const mockConversation: ChatConversation = {
      id: 'conv-1',
      participant: {
        id: 'seller-1',
        name: 'Test Seller',
        isOnline: true
      },
      unreadCount: 0,
      updatedAt: new Date()
    };

    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        content: 'Test message',
        senderId: 'user-1',
        senderName: 'User',
        timestamp: new Date(),
        isRead: true,
        isOwnMessage: true
      }
    ];

    fixture.componentRef.setInput('conversation', mockConversation);
    fixture.componentRef.setInput('messages', mockMessages);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.text-base')?.textContent).toContain('Test message');
  });
});

