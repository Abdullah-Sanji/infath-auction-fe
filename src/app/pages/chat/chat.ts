import { Component, signal, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatService } from './services/chat.service';
import { ChatMessage, ChatConversation } from './interfaces/chat.interface';
import { firstValueFrom } from 'rxjs';
import { ConversationsList } from '../../shared/components/chat/conversations-list/conversations-list';
import { ChatMessages } from '../../shared/components/chat/chat-messages/chat-messages';

@Component({
  selector: 'app-chat',
  imports: [ConversationsList, ChatMessages],
  providers: [ChatService],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);

  // Conversations list
  conversations = signal<ChatConversation[]>([]);

  // Selected conversation
  selectedConversation = signal<ChatConversation | null>(null);

  // Messages
  messages = signal<ChatMessage[]>([]);

  // Loading states
  isLoadingConversations = signal<boolean>(false);
  isLoadingMessages = signal<boolean>(false);
  isSending = signal<boolean>(false);

  // Conversation ID
  conversationId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    // Load conversations list
    await this.loadConversations();

    // Get conversation ID from route params or query params
    const conversationId =
      this.route.snapshot.queryParams['conversationId'] || this.route.snapshot.params['id'] || null;

    if (conversationId) {
      // Check if conversation exists, if not create it
      const existingConv = this.conversations().find((c) => c.id === conversationId);
      if (!existingConv) {
        // Create new conversation from route params
        const sellerId = this.route.snapshot.queryParams['sellerId'];
        if (sellerId) {
          const newConversation: ChatConversation = {
            id: conversationId,
            participant: {
              id: sellerId,
              name: sellerId,
              image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
              isVerified: true,
              isOnline: false,
            },
            unreadCount: 0,
            updatedAt: new Date(),
          };
          this.conversations.update((convs) => [newConversation, ...convs]);
        }
      }
      this.conversationId.set(conversationId);
      await this.selectConversation(conversationId);
    } else if (this.conversations().length > 0) {
      // Select first conversation by default
      await this.selectConversation(this.conversations()[0].id);
    }
  }

  async loadConversations(): Promise<void> {
    this.isLoadingConversations.set(true);

    try {
      const conversations = await firstValueFrom(this.chatService.getConversations());

      // If no conversations from API, create mock data
      if (conversations.length === 0) {
        const mockConversations: ChatConversation[] = [
          {
            id: 'conv-1',
            participant: {
              id: 'seller-1',
              name: 'مؤسسة أرصاد العقارية',
              image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
              isVerified: true,
              isOnline: true,
            },
            lastMessage: {
              id: 'msg-1',
              content: 'مرحباً، هل لديك أي استفسار حول المزاد؟',
              senderId: 'seller-1',
              senderName: 'مؤسسة أرصاد العقارية',
              timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
              isRead: true,
              isOwnMessage: false,
            },
            unreadCount: 0,
            updatedAt: new Date(),
          },
          {
            id: 'conv-2',
            participant: {
              id: 'seller-2',
              name: 'شركة المزادات الوطنية',
              image:
                'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop',
              isVerified: true,
              isOnline: false,
            },
            lastMessage: {
              id: 'msg-2',
              content: 'شكراً لك على استفسارك',
              senderId: 'current-user',
              senderName: 'You',
              timestamp: new Date(Date.now() - 2 * 60 * 60000), // 2 hours ago
              isRead: true,
              isOwnMessage: true,
            },
            unreadCount: 2,
            updatedAt: new Date(Date.now() - 2 * 60 * 60000),
          },
        ];
        this.conversations.set(mockConversations);
      } else {
        this.conversations.set(conversations);
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      this.conversations.set([]);
    } finally {
      this.isLoadingConversations.set(false);
    }
  }

  async selectConversation(conversationId: string): Promise<void> {
    const conversation = this.conversations().find((c) => c.id === conversationId);
    if (!conversation) {
      return;
    }

    this.selectedConversation.set(conversation);
    this.conversationId.set(conversationId);

    // Load messages for this conversation
    await this.loadMessages(conversationId);
  }

  async loadMessages(conversationId: string): Promise<void> {
    this.isLoadingMessages.set(true);

    try {
      const messages = await firstValueFrom(this.chatService.getMessages(conversationId));

      this.messages.set(messages);
    } catch (error) {
      console.error('Failed to load messages:', error);
      this.messages.set([]);
    } finally {
      this.isLoadingMessages.set(false);
    }
  }

  async onMessageSent(text: string): Promise<void> {
    if (!text || this.isSending() || !this.conversationId()) {
      return;
    }

    this.isSending.set(true);

    try {
      const conversationId = this.conversationId()!;
      const newMessage = await firstValueFrom(this.chatService.sendMessage(conversationId, text));

      // Add message to list
      this.messages.update((msgs) => [...msgs, newMessage]);

      // Update conversation's last message
      this.conversations.update((convs) => {
        return convs.map((conv) => {
          if (conv.id === conversationId) {
            return {
              ...conv,
              lastMessage: newMessage,
              updatedAt: new Date(),
            };
          }
          return conv;
        });
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      this.isSending.set(false);
    }
  }

  onConversationSelected(conversationId: string): void {
    this.selectConversation(conversationId);
  }
}
