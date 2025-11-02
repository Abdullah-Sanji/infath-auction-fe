import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Textarea } from './textarea';

describe('Textarea', () => {
  let component: Textarea;
  let fixture: ComponentFixture<Textarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Textarea, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Textarea);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value', () => {
    component.value.set('Test text');
    fixture.detectChanges();
    expect(component.value()).toBe('Test text');
  });

  it('should handle autoResize', () => {
    component.autoResize.set(true);
    fixture.detectChanges();
    expect(component.autoResize()).toBe(true);
  });

  it('should handle disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onChange event', () => {
    spyOn(component.onInput, 'emit');
    const event = new Event('input');
    component.handleInput(event);
    expect(component.onInput.emit).toHaveBeenCalledWith(event);
  });

  it('should implement ControlValueAccessor', () => {
    const testValue = 'test';
    component.writeValue(testValue);
    expect(component.value()).toBe(testValue);

    let registeredValue: string | null = null;
    component.registerOnChange((value) => {
      registeredValue = value;
    });
    component.value.set('new');
    expect(registeredValue).toBe('new');
  });
});

