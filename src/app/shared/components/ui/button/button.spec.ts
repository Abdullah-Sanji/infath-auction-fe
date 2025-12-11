import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Button } from './button';

describe('Button', () => {
  let component: Button;
  let fixture: ComponentFixture<Button>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Button]
    }).compileComponents();

    fixture = TestBed.createComponent(Button);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render with label', () => {
    component.label.set('Test Button');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('p-button');
    expect(button).toBeTruthy();
    expect(button.getAttribute('ng-reflect-label')).toBe('Test Button');
  });

  it('should emit onClick event', () => {
    spyOn(component.onClick, 'emit');
    const mockEvent = new Event('click');

    component.onClick.emit(mockEvent);

    expect(component.onClick.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onFocus event', () => {
    spyOn(component.onFocus, 'emit');
    const mockEvent = new Event('focus');

    component.onFocus.emit(mockEvent);

    expect(component.onFocus.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onBlur event', () => {
    spyOn(component.onBlur, 'emit');
    const mockEvent = new Event('blur');

    component.onBlur.emit(mockEvent);

    expect(component.onBlur.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should set disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('p-button');
    expect(button.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set loading state', () => {
    component.loading.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('p-button');
    expect(button.getAttribute('ng-reflect-loading')).toBe('true');
  });

  it('should set severity', () => {
    component.severity.set('danger');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('p-button');
    expect(button.getAttribute('ng-reflect-severity')).toBe('danger');
  });

  it('should set icon', () => {
    component.icon.set('pi pi-check');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const button = compiled.querySelector('p-button');
    expect(button.getAttribute('ng-reflect-icon')).toBe('pi pi-check');
  });

  it('should compute button class with size', () => {
    component.size.set('large');
    fixture.detectChanges();

    expect(component.buttonClass()).toBe('p-button-large');
  });

  it('should have default values', () => {
    expect(component.label()).toBe('');
    expect(component.icon()).toBe('');
    expect(component.iconPos()).toBe('left');
    expect(component.severity()).toBe('primary');
    expect(component.loading()).toBe(false);
    expect(component.disabled()).toBe(false);
  });
});
