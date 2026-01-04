import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Chat } from './chat';
import { ChatService } from './services/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TranslocoService } from '@jsverse/transloco';
import { ChatConversation } from './interfaces/chat.interface';

describe('Chat', () => {
  let component: Chat;
  let fixture: ComponentFixture<Chat>;
  let mockChatService: jasmine.SpyObj<ChatService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockChatService = jasmine.createSpyObj('ChatService', [
      'getConversations',
      'getMessages',
      'sendMessage',
      'getParticipant'
    ]);

    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
        params: {}
      }
    };

    const mockTranslocoService = jasmine.createSpyObj('TranslocoService', [
      'selectTranslate',
      'translate'
    ]);
    mockTranslocoService.selectTranslate.and.returnValue(of(''));

    await TestBed.configureTestingModule({
      imports: [Chat],
      providers: [
        { provide: ChatService, useValue: mockChatService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: TranslocoService, useValue: mockTranslocoService }
      ]
    }).compileComponents();

    mockChatService.getConversations.and.returnValue(of([]));
    mockChatService.getMessages.and.returnValue(of([]));

    fixture = TestBed.createComponent(Chat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty conversations', () => {
    expect(component.conversations().length).toBeGreaterThanOrEqual(0);
  });

  it('should load conversations on init', async () => {
    const mockConversations: ChatConversation[] = [
      {
        id: 'conv-1',
        participant: {
          id: 'seller-1',
          name: 'Test Seller',
          isOnline: true,
          isVerified: true
        },
        unreadCount: 0,
        updatedAt: new Date()
      }
    ];

    mockChatService.getConversations.and.returnValue(of(mockConversations));
    await component.loadConversations();

    expect(component.conversations().length).toBeGreaterThan(0);
  });

  it('should select a conversation', async () => {
    const mockConversations: ChatConversation[] = [
      {
        id: 'conv-1',
        participant: {
          id: 'seller-1',
          name: 'Test Seller',
          isOnline: true
        },
        unreadCount: 0,
        updatedAt: new Date()
      }
    ];

    component.conversations.set(mockConversations);
    mockChatService.getMessages.and.returnValue(of([]));

    await component.selectConversation('conv-1');

    expect(component.selectedConversation()?.id).toBe('conv-1');
    expect(component.conversationId()).toBe('conv-1');
  });

  it('should handle message sending', async () => {
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

    component.selectedConversation.set(mockConversation);
    component.conversationId.set('conv-1');

    const mockMessage = {
      id: 'msg-1',
      content: 'Test message',
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      isRead: false,
      isOwnMessage: true
    };

    mockChatService.sendMessage.and.returnValue(of(mockMessage));

    await component.onMessageSent('Test message');

    expect(component.messages().length).toBeGreaterThan(0);
  });

  it('should handle conversation selection', () => {
    const mockConversations: ChatConversation[] = [
      {
        id: 'conv-1',
        participant: {
          id: 'seller-1',
          name: 'Test Seller One',
          isOnline: true
        },
        unreadCount: 0,
        updatedAt: new Date()
      }
    ];

    component.conversations.set(mockConversations);
    mockChatService.getMessages.and.returnValue(of([]));

    component.onConversationSelected('conv-1');

    expect(component.conversationId()).toBe('conv-1');
  });


  it('should handle error when loading conversations', async () => {
    mockChatService.getConversations.and.returnValue(
      throwError(() => new Error('API Error'))
    );

    await component.loadConversations();

    expect(component.error()).toBeTruthy();
  });

});

