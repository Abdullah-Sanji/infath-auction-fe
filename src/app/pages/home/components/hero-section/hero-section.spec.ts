import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroSection } from './hero-section';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoTestingModule } from '@jsverse/transloco';

describe('HeroSection', () => {
  let component: HeroSection;
  let fixture: ComponentFixture<HeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HeroSection,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'ar',
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('AI Assistant functionality', () => {
    it('should initialize with empty AI question', () => {
      expect(component.aiQuestion()).toBe('');
    });

    it('should have three suggested questions', () => {
      expect(component.suggestedQuestions.length).toBe(3);
      expect(component.suggestedQuestions[0].text).toBe('ما هي المزادات المتاحة في الرياض؟');
      expect(component.suggestedQuestions[1].text).toBe('كيف أشارك في مزاد عقاري؟');
      expect(component.suggestedQuestions[2].text).toBe('ما الفرق بين المزاد المباشر والإلكتروني؟');
    });

    it('should update AI question signal when input changes', () => {
      component.aiQuestion.set('ما هي المزادات المتاحة؟');
      expect(component.aiQuestion()).toBe('ما هي المزادات المتاحة؟');
    });

    it('should emit question when submitAiQuestion is called with valid question', () => {
      let emittedQuestion = '';
      component.onAskQuestion.subscribe((question: string) => {
        emittedQuestion = question;
      });

      component.aiQuestion.set('ما هي المزادات المتاحة؟');
      component.submitAiQuestion();

      expect(emittedQuestion).toBe('ما هي المزادات المتاحة؟');
      expect(component.aiQuestion()).toBe(''); // Should clear after submission
    });

    it('should not emit question when submitAiQuestion is called with empty question', () => {
      let emitted = false;
      component.onAskQuestion.subscribe(() => {
        emitted = true;
      });

      component.aiQuestion.set('   ');
      component.submitAiQuestion();

      expect(emitted).toBe(false);
    });

    it('should trim whitespace from question before submission', () => {
      let emittedQuestion = '';
      component.onAskQuestion.subscribe((question: string) => {
        emittedQuestion = question;
      });

      component.aiQuestion.set('  ما هي المزادات؟  ');
      component.submitAiQuestion();

      expect(emittedQuestion).toBe('ما هي المزادات؟');
    });

    it('should set and submit question when suggested question is clicked', () => {
      let emittedQuestion = '';
      component.onAskQuestion.subscribe((question: string) => {
        emittedQuestion = question;
      });

      const suggestedQuestion = 'ما هي المزادات المتاحة في الرياض؟';
      component.selectSuggestedQuestion(suggestedQuestion);

      expect(emittedQuestion).toBe(suggestedQuestion);
      expect(component.aiQuestion()).toBe(''); // Should clear after submission
    });
  });

  describe('Search filters functionality', () => {
    it('should initialize with null filter values', () => {
      expect(component.selectedAuctionType()).toBeNull();
      expect(component.selectedPrice()).toBeNull();
      expect(component.selectedDate()).toBeNull();
    });

    it('should have price options', () => {
      expect(component.priceOptions.length).toBe(5);
      expect(component.priceOptions[0].value).toBe('all');
    });

    it('should have auction type options', () => {
      expect(component.auctionTypeOptions.length).toBe(5);
      expect(component.auctionTypeOptions[0].value).toBe('all');
    });

    it('should update selectedPrice when onPriceChange is called', () => {
      component.onPriceChange({ value: '1000-5000' });
      expect(component.selectedPrice()).toBe('1000-5000');
    });

    it('should update selectedAuctionType when onAuctionTypeChange is called', () => {
      component.onAuctionTypeChange({ value: 'realEstate' });
      expect(component.selectedAuctionType()).toBe('realEstate');
    });

    it('should update selectedDate when onDateChange is called with Date', () => {
      const testDate = new Date('2025-01-15');
      component.onDateChange({ value: testDate });
      expect(component.selectedDate()).toEqual(testDate);
    });

    it('should set selectedDate to null when onDateChange is called with non-Date', () => {
      component.selectedDate.set(new Date());
      component.onDateChange({ value: 'invalid' });
      expect(component.selectedDate()).toBeNull();
    });

    it('should emit search event with all filter values when triggerSearch is called', () => {
      let emittedData: { price: string | null; date: Date | null; auctionType: string | null } | null = null;
      component.onSearchClick.subscribe((data) => {
        emittedData = data;
      });

      const testDate = new Date('2025-01-15');
      component.selectedPrice.set('1000-5000');
      component.selectedDate.set(testDate);
      component.selectedAuctionType.set('realEstate');

      component.triggerSearch();

      expect(emittedData).toEqual({
        price: '1000-5000',
        date: testDate,
        auctionType: 'realEstate',
      });
    });

    it('should emit search event with null values when no filters selected', () => {
      let emittedData: { price: string | null; date: Date | null; auctionType: string | null } | null = null;
      component.onSearchClick.subscribe((data) => {
        emittedData = data;
      });

      component.triggerSearch();

      expect(emittedData).toEqual({
        price: null,
        date: null,
        auctionType: null,
      });
    });
  });

  describe('Component rendering', () => {
    it('should render AI assistant card', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const aiCard = compiled.querySelector('.bg-gradient-to-br');
      expect(aiCard).toBeTruthy();
    });

    it('should render all suggested question buttons', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const suggestionButtons = compiled.querySelectorAll('button[class*="rounded-lg border"]');
      expect(suggestionButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render search bar with filters', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const searchBar = compiled.querySelector('.bg-\\[\\#1b8354\\]');
      expect(searchBar).toBeTruthy();
    });

    it('should render hero title and subtitle', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      const title = compiled.querySelector('h1');
      const subtitle = compiled.querySelector('p.text-xl');
      expect(title).toBeTruthy();
      expect(subtitle).toBeTruthy();
    });
  });

  describe('Signal state management', () => {
    it('should update aiQuestion signal reactively', () => {
      const initialValue = component.aiQuestion();
      component.aiQuestion.set('new question');
      expect(component.aiQuestion()).not.toBe(initialValue);
      expect(component.aiQuestion()).toBe('new question');
    });

    it('should update filter signals reactively', () => {
      component.selectedPrice.set('5000-10000');
      component.selectedAuctionType.set('vehicles');
      
      expect(component.selectedPrice()).toBe('5000-10000');
      expect(component.selectedAuctionType()).toBe('vehicles');
    });
  });
});
