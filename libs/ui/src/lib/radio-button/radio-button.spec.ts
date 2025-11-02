import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RadioButton } from './radio-button';

describe('RadioButton', () => {
  let component: RadioButton;
  let fixture: ComponentFixture<RadioButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioButton, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(RadioButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value', () => {
    component.value.set('option1');
    fixture.detectChanges();
    expect(component.value()).toBe('option1');
  });

  it('should handle disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onClick event', () => {
    spyOn(component.onClick, 'emit');
    const event = new Event('click');
    component.handleClick(event);
    expect(component.onClick.emit).toHaveBeenCalledWith(event);
  });

  it('should implement ControlValueAccessor', () => {
    const testValue = 'test';
    component.writeValue(testValue);
    expect(component.value()).toBe(testValue);

    let registeredValue: any = null;
    component.registerOnChange((value) => {
      registeredValue = value;
    });
    component.value.set('new');
    expect(registeredValue).toBe('new');
  });
});

