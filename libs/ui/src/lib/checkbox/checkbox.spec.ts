import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Checkbox } from './checkbox';

describe('Checkbox', () => {
  let component: Checkbox;
  let fixture: ComponentFixture<Checkbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Checkbox, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Checkbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value', () => {
    component.value.set(true);
    fixture.detectChanges();
    expect(component.value()).toBe(true);
  });

  it('should handle disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onChange event', () => {
    spyOn(component.onChange, 'emit');
    const event = { checked: true };
    component.handleChange(event);
    expect(component.onChange.emit).toHaveBeenCalledWith(event);
  });

  it('should implement ControlValueAccessor', () => {
    const testValue = true;
    component.writeValue(testValue);
    expect(component.value()).toBe(testValue);

    let registeredValue: boolean | null = null;
    component.registerOnChange((value) => {
      registeredValue = value;
    });
    component.value.set(false);
    expect(registeredValue).toBe(false);
  });
});

