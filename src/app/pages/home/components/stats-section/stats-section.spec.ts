import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoModule } from '@jsverse/transloco';
import { StatsSection } from './stats-section';

describe('StatsSection', () => {
  let component: StatsSection;
  let fixture: ComponentFixture<StatsSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsSection, TranslocoModule],
    }).compileComponents();

    fixture = TestBed.createComponent(StatsSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have three stat items', () => {
    expect(component.stats().length).toBe(3);
  });

  it('should display correct stat values', () => {
    const stats = component.stats();
    expect(stats[0].value).toBe('123,204');
    expect(stats[1].value).toBe('50,343');
    expect(stats[2].value).toBe('20,000');
  });

  it('should have correct icons for each stat', () => {
    const stats = component.stats();
    expect(stats[0].icon).toBe('images/icons/hummer.svg');
    expect(stats[1].icon).toBe('images/icons/people-green.svg');
    expect(stats[2].icon).toBe('images/icons/companies.svg');
  });

  it('should have correct translation keys', () => {
    const stats = component.stats();
    expect(stats[0].label).toBe('home.stats.executedAuctions');
    expect(stats[1].label).toBe('home.stats.registeredUsers');
    expect(stats[2].label).toBe('home.stats.participatingCompanies');
  });

  it('should render all stat items in the template', () => {
    const compiled = fixture.nativeElement;
    const statElements = compiled.querySelectorAll('.flex-1');
    expect(statElements.length).toBe(3);
  });

  it('should render icons with correct src attributes', () => {
    const compiled = fixture.nativeElement;
    const images = compiled.querySelectorAll('img');
    expect(images.length).toBe(3);
    expect(images[0].getAttribute('src')).toBe('images/icons/hummer.svg');
    expect(images[1].getAttribute('src')).toBe('images/icons/people-green.svg');
    expect(images[2].getAttribute('src')).toBe('images/icons/companies.svg');
  });

  it('should apply border to items after the first', () => {
    const compiled = fixture.nativeElement;
    const statElements = compiled.querySelectorAll('.flex-1');
    
    // First element should not have border
    expect(statElements[0].classList.contains('border-s')).toBe(false);
    
    // Second and third elements should have border
    expect(statElements[1].classList.contains('border-s')).toBe(true);
    expect(statElements[2].classList.contains('border-s')).toBe(true);
  });
});
