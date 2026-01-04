import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConversationsList } from './conversations-list';
import { TranslocoService } from '@jsverse/transloco';
import { of } from 'rxjs';
import { ChatConversation } from '../../../../pages/chat/interfaces/chat.interface';

describe('ConversationsList', () => {
  let component: ConversationsList;
  let fixture: ComponentFixture<ConversationsList>;

  beforeEach(async () => {
    const mockTranslocoService = jasmine.createSpyObj('TranslocoService', [
      'selectTranslate',
      'translate'
    ]);
    mockTranslocoService.selectTranslate.and.returnValue(of(''));

    await TestBed.configureTestingModule({
      imports: [ConversationsList],
      providers: [{ provide: TranslocoService, useValue: mockTranslocoService }]
    }).compileComponents();

    fixture = TestBed.createComponent(ConversationsList);
    component = fixture.componentInstance;

    // Set required inputs
    fixture.componentRef.setInput('conversations', []);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter conversations by search query', () => {
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
      },
      {
        id: 'conv-2',
        participant: {
          id: 'seller-2',
          name: 'Test Seller Two',
          isOnline: false
        },
        unreadCount: 0,
        updatedAt: new Date()
      }
    ];

    fixture.componentRef.setInput('conversations', mockConversations);
    component.searchQuery.set('One');

    const filtered = component.filteredConversations();
    expect(filtered.length).toBe(1);
    expect(filtered[0].participant.name).toContain('One');
  });

  it('should filter conversations by unread status', () => {
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
      },
      {
        id: 'conv-2',
        participant: {
          id: 'seller-2',
          name: 'Test Seller Two',
          isOnline: false
        },
        unreadCount: 5,
        updatedAt: new Date()
      }
    ];

    fixture.componentRef.setInput('conversations', mockConversations);
    component.selectFilter('unread');

    const filtered = component.filteredConversations();
    expect(filtered.length).toBe(1);
    expect(filtered[0].unreadCount).toBeGreaterThan(0);
  });

  it('should calculate total unread count', () => {
    const mockConversations: ChatConversation[] = [
      {
        id: 'conv-1',
        participant: { id: 'seller-1', name: 'Test 1', isOnline: true },
        unreadCount: 3,
        updatedAt: new Date()
      },
      {
        id: 'conv-2',
        participant: { id: 'seller-2', name: 'Test 2', isOnline: false },
        unreadCount: 5,
        updatedAt: new Date()
      }
    ];

    fixture.componentRef.setInput('conversations', mockConversations);
    expect(component.unreadCount()).toBe(8);
  });

  it('should emit event when conversation is clicked', () => {
    spyOn(component.conversationSelected, 'emit');

    component.onConversationClick('conv-1');

    expect(component.conversationSelected.emit).toHaveBeenCalledWith('conv-1');
  });

  it('should format conversation date correctly', () => {
    const testDate = new Date('2025-01-23T10:30:00');
    const formatted = component.formatConversationDate(testDate);
    expect(formatted).toBe('23/01/2025');
  });
});

