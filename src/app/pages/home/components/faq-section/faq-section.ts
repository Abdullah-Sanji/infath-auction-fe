import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { Accordion } from '../../../../shared/components/ui/accordion/accordion';

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-faq-section',
  imports: [CommonModule, TranslocoModule, Accordion],
  templateUrl: './faq-section.html',
  styleUrl: './faq-section.scss'
})
export class FaqSection {
  faqItems = signal<FaqItem[]>([
    {
      id: 'whatIsPlatform',
      questionKey: 'faq.questions.whatIsPlatform.question',
      answerKey: 'faq.questions.whatIsPlatform.answer',
      isOpen: false
    },
    {
      id: 'howToParticipate',
      questionKey: 'faq.questions.howToParticipate.question',
      answerKey: 'faq.questions.howToParticipate.answer',
      isOpen: false
    },
    {
      id: 'paymentProcess',
      questionKey: 'faq.questions.paymentProcess.question',
      answerKey: 'faq.questions.paymentProcess.answer',
      isOpen: false
    },
    {
      id: 'allElectronic',
      questionKey: 'faq.questions.allElectronic.question',
      answerKey: 'faq.questions.allElectronic.answer',
      isOpen: false
    },
    {
      id: 'howToContact',
      questionKey: 'faq.questions.howToContact.question',
      answerKey: 'faq.questions.howToContact.answer',
      isOpen: false
    }
  ]);

  onToggle(index: number, isOpen: boolean): void {
    const items = this.faqItems();
    items[index].isOpen = isOpen;
    this.faqItems.set([...items]);
  }

  onViewAll(): void {
    // TODO: Navigate to full FAQ page or expand all items
    console.log('View all FAQs clicked');
  }
}
