import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqSection } from './faq-section';
import { TranslocoModule } from '@jsverse/transloco';
import { getTranslocoModule } from '../../../../core/services/transloco-loader';

describe('FaqSection', () => {
  let component: FaqSection;
  let fixture: ComponentFixture<FaqSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FaqSection,
        getTranslocoModule()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FaqSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with 5 FAQ items', () => {
    expect(component.faqItems().length).toBe(5);
  });

  it('should initialize all FAQ items as closed', () => {
    const items = component.faqItems();
    items.forEach(item => {
      expect(item.isOpen).toBe(false);
    });
  });

  it('should have correct FAQ item structure', () => {
    const items = component.faqItems();
    items.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.questionKey).toBeDefined();
      expect(item.answerKey).toBeDefined();
      expect(typeof item.isOpen).toBe('boolean');
    });
  });

  it('should render all FAQ items', () => {
    const accordions = fixture.nativeElement.querySelectorAll('app-accordion');
    expect(accordions.length).toBe(5);
  });

  it('should toggle FAQ item state', () => {
    const initialState = component.faqItems()[0].isOpen;
    
    component.onToggle(0, !initialState);
    
    expect(component.faqItems()[0].isOpen).toBe(!initialState);
  });

  it('should update specific FAQ item without affecting others', () => {
    component.onToggle(1, true);
    
    const items = component.faqItems();
    expect(items[0].isOpen).toBe(false);
    expect(items[1].isOpen).toBe(true);
    expect(items[2].isOpen).toBe(false);
  });

  it('should render title section', () => {
    const titleElement = fixture.nativeElement.querySelector('h2');
    expect(titleElement).toBeTruthy();
  });

  it('should render subtitle', () => {
    const subtitleElement = fixture.nativeElement.querySelector('p.text-xl');
    expect(subtitleElement).toBeTruthy();
  });

  it('should render FAQ icon', () => {
    const icon = fixture.nativeElement.querySelector('svg');
    expect(icon).toBeTruthy();
  });

  it('should render view all button', () => {
    const button = fixture.nativeElement.querySelector('button[type="button"]');
    expect(button).toBeTruthy();
  });

  it('should call onViewAll when button is clicked', () => {
    spyOn(component, 'onViewAll');
    
    const button = fixture.nativeElement.querySelector('button[type="button"]');
    button?.click();
    
    expect(component.onViewAll).toHaveBeenCalled();
  });

  it('should have correct translation keys for first FAQ item', () => {
    const firstItem = component.faqItems()[0];
    expect(firstItem.questionKey).toBe('faq.questions.whatIsPlatform.question');
    expect(firstItem.answerKey).toBe('faq.questions.whatIsPlatform.answer');
  });

  it('should maintain FAQ items order', () => {
    const items = component.faqItems();
    expect(items[0].id).toBe('whatIsPlatform');
    expect(items[1].id).toBe('howToParticipate');
    expect(items[2].id).toBe('paymentProcess');
    expect(items[3].id).toBe('allElectronic');
    expect(items[4].id).toBe('howToContact');
  });

  it('should toggle multiple items independently', () => {
    component.onToggle(0, true);
    component.onToggle(2, true);
    
    const items = component.faqItems();
    expect(items[0].isOpen).toBe(true);
    expect(items[1].isOpen).toBe(false);
    expect(items[2].isOpen).toBe(true);
    expect(items[3].isOpen).toBe(false);
    expect(items[4].isOpen).toBe(false);
  });

  it('should close an open item', () => {
    component.onToggle(0, true);
    expect(component.faqItems()[0].isOpen).toBe(true);
    
    component.onToggle(0, false);
    expect(component.faqItems()[0].isOpen).toBe(false);
  });

  it('should have gradient background on title underline', () => {
    const gradient = fixture.nativeElement.querySelector('.bg-gradient-to-r');
    expect(gradient).toBeTruthy();
    expect(gradient.classList.contains('from-[rgba(59,190,187,0.8)]')).toBe(true);
    expect(gradient.classList.contains('to-[rgba(115,198,167,0.8)]')).toBe(true);
  });

  it('should have proper button styling', () => {
    const button = fixture.nativeElement.querySelector('button[type="button"]');
    expect(button.classList.contains('bg-[#1b8354]')).toBe(true);
    expect(button.classList.contains('hover:bg-[#156b44]')).toBe(true);
  });
});
