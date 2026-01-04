import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ChatMessage, ChatParticipant, ChatConversation } from '../interfaces/chat.interface';

@Injectable()
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = '/api/chat';

  getMessages(conversationId: string): Observable<ChatMessage[]> {
    // TODO: Replace with actual API call
    // Mock messages for demonstration
    const mockMessages: ChatMessage[] = [
      {
        id: 'msg-1',
        content: 'مرحبا، متى يمكن معاينة الفيلا؟',
        senderId: 'current-user',
        senderName: 'أنت',
        timestamp: new Date(Date.now() - 30 * 60000),
        isRead: true,
        isOwnMessage: true
      },
      {
        id: 'msg-2',
        content: 'متاحة السبت الساعة ٣ أو الأحد',
        senderId: conversationId,
        senderName: 'البائع',
        timestamp: new Date(Date.now() - 28 * 60000),
        isRead: true,
        isOwnMessage: false
      },
      {
        id: 'msg-3',
        content: 'هل يمكن تحديد موعد لمعاينة الفيلا؟',
        senderId: 'current-user',
        senderName: 'أنت',
        timestamp: new Date(Date.now() - 25 * 60000),
        isRead: true,
        isOwnMessage: true
      },
      {
        id: 'msg-4',
        content: 'السبت في تمام الساعة 3:30 مساءً أو الأحد في أي وقت.',
        senderId: conversationId,
        senderName: 'البائع',
        timestamp: new Date(Date.now() - 20 * 60000),
        isRead: true,
        isOwnMessage: false
      },
      {
        id: 'msg-5',
        content: 'اين الموقع في الضبط؟',
        senderId: 'current-user',
        senderName: 'أنت',
        timestamp: new Date(Date.now() - 15 * 60000),
        isRead: true,
        isOwnMessage: true
      }
    ];
    return of(mockMessages);
  }

  sendMessage(conversationId: string, content: string): Observable<ChatMessage> {
    // TODO: Replace with actual API call
    return of({
      id: Date.now().toString(),
      content,
      senderId: 'current-user',
      senderName: 'You',
      timestamp: new Date(),
      isRead: false,
      isOwnMessage: true
    });
  }

  getConversations(): Observable<ChatConversation[]> {
    // TODO: Replace with actual API call
    return of([]);
  }

  getParticipant(participantId: string): Observable<ChatParticipant> {
    // TODO: Replace with actual API call
    return of({
      id: participantId,
      name: 'Unknown',
      isOnline: false
    });
  }
}

