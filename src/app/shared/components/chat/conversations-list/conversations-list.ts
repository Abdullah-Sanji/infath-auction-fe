import { Component, signal, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ChatConversation } from '../../../../pages/chat/interfaces/chat.interface';

@Component({
  selector: 'app-conversations-list',
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './conversations-list.html',
  styleUrl: './conversations-list.scss',
})
export class ConversationsList {
  // Inputs
  conversations = input.required<ChatConversation[]>();
  selectedConversationId = input<string | null>(null);
  isLoading = input<boolean>(false);

  // Outputs
  conversationSelected = output<string>();

  // Local state
  searchQuery = signal<string>('');
  selectedFilter = signal<'all' | 'unread'>('all');

  // Computed
  unreadCount = computed(() => {
    return this.conversations().reduce((sum, conv) => sum + conv.unreadCount, 0);
  });

  filteredConversations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const filter = this.selectedFilter();
    let convs = this.conversations();

    // Apply filter
    if (filter === 'unread') {
      convs = convs.filter(conv => conv.unreadCount > 0);
    }

    // Apply search
    if (query) {
      convs = convs.filter(conv =>
        conv.participant.name.toLowerCase().includes(query) ||
        conv.lastMessage?.content.toLowerCase().includes(query)
      );
    }

    return convs;
  });

  selectFilter(filter: 'all' | 'unread'): void {
    this.selectedFilter.set(filter);
  }

  onConversationClick(conversationId: string): void {
    this.conversationSelected.emit(conversationId);
  }

  formatConversationDate(date: Date): string {
    const messageDate = new Date(date);
    const day = messageDate.getDate().toString().padStart(2, '0');
    const month = (messageDate.getMonth() + 1).toString().padStart(2, '0');
    const year = messageDate.getFullYear();
    return `${day}/${month}/${year}`;
  }
}

