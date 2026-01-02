import { CommonModule } from '@angular/common';
import { Component, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dropdown } from '@shared/components/ui/dropdown/dropdown';
import { Datepicker } from '@shared/components/ui/datepicker/datepicker';

export interface PriceOption {
  label: string;
  value: string;
}

export interface AuctionTypeOption {
  label: string;
  value: string;
}

export interface SuggestedQuestion {
  text: string;
}

@Component({
  selector: 'app-hero-section',
  imports: [CommonModule, FormsModule, Dropdown, Datepicker],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  onSearchClick = output<{ price: string | null; date: Date | null; auctionType: string | null }>();
  onAskQuestion = output<string>();

  // AI Assistant state
  aiQuestion = signal<string>('');

  // Search filters state
  selectedAuctionType = signal<string | null>(null);
  selectedPrice = signal<string | null>(null);
  selectedDate = signal<Date | null>(null);

  // Filter options
  priceOptions: PriceOption[] = [
    { label: 'جميع الأسعار', value: 'all' },
    { label: 'أقل من 1000', value: '0-1000' },
    { label: '1000 - 5000', value: '1000-5000' },
    { label: '5000 - 10000', value: '5000-10000' },
    { label: 'أكثر من 10000', value: '10000+' },
  ];

  auctionTypeOptions: AuctionTypeOption[] = [
    { label: 'جميع الأنواع', value: 'all' },
    { label: 'البضائع العامة', value: 'general' },
    { label: 'الأصول المنقولة', value: 'movables' },
    { label: 'المركبات', value: 'vehicles' },
    { label: 'العقارات', value: 'realEstate' },
  ];

  // Suggested questions for AI assistant
  suggestedQuestions: SuggestedQuestion[] = [
    { text: 'ما هي المزادات المتاحة في الرياض؟' },
    { text: 'كيف أشارك في مزاد عقاري؟' },
    { text: 'ما الفرق بين المزاد المباشر والإلكتروني؟' },
  ];

  /**
   * Handle AI question submission
   */
  submitAiQuestion(): void {
    const question = this.aiQuestion().trim();
    if (question) {
      this.onAskQuestion.emit(question);
      this.aiQuestion.set('');
    }
  }

  /**
   * Handle suggested question click
   */
  selectSuggestedQuestion(question: string): void {
    this.aiQuestion.set(question);
    this.submitAiQuestion();
  }

  /**
   * Handle search button click
   */
  triggerSearch(): void {
    this.onSearchClick.emit({
      price: this.selectedPrice(),
      date: this.selectedDate(),
      auctionType: this.selectedAuctionType(),
    });
  }

  /**
   * Handle price filter change
   */
  onPriceChange(event: { value: unknown }): void {
    this.selectedPrice.set(event.value as string | null);
  }

  /**
   * Handle date filter change
   */
  onDateChange(event: { value: Date | Date[] | string | string[] | null }): void {
    if (event.value instanceof Date) {
      this.selectedDate.set(event.value);
    } else {
      this.selectedDate.set(null);
    }
  }

  /**
   * Handle auction type filter change
   */
  onAuctionTypeChange(event: { value: unknown }): void {
    this.selectedAuctionType.set(event.value as string | null);
  }
}
