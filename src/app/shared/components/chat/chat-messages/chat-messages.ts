import { Component, signal, input, output, effect, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ChatMessage, ChatConversation } from '../../../../pages/chat/interfaces/chat.interface';

@Component({
  selector: 'app-chat-messages',
  imports: [CommonModule, FormsModule, TranslocoPipe],
  templateUrl: './chat-messages.html',
  styleUrl: './chat-messages.scss',
})
export class ChatMessages implements OnInit {
  private platformId = inject(PLATFORM_ID);

  // Inputs
  conversation = input<ChatConversation | null>(null);
  messages = input<ChatMessage[]>([]);
  isLoading = input<boolean>(false);

  // Outputs
  messageSent = output<string>();

  // Local state
  messageText = signal<string>('');
  isSending = signal<boolean>(false);

  constructor() {
    // Scroll to bottom when new messages arrive
    effect(() => {
      const msgs = this.messages();
      if (msgs.length > 0 && isPlatformBrowser(this.platformId)) {
        setTimeout(() => this.scrollToBottom(), 100);
      }
    });
  }

  ngOnInit(): void {
    // Initial scroll
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.scrollToBottom(), 100);
    }
  }

  sendMessage(): void {
    const text = this.messageText().trim();
    if (!text || this.isSending()) {
      return;
    }

    this.messageSent.emit(text);
    this.messageText.set('');
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  scrollToBottom(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  formatMessageTime(date: Date): string {
    const messageDate = new Date(date);
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

