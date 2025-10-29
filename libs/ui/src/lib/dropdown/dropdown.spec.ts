import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dropdown } from './dropdown';
import { FormsModule } from '@angular/forms';

describe('Dropdown', () => {
  let component: Dropdown;
  let fixture: ComponentFixture<Dropdown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdown, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdown);
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

  it('should handle options array', () => {
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    expect(component.options()).toEqual(options);
  });

  it('should handle placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Choose an option');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Choose an option');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onChange event', () => {
    let emittedEvent: { originalEvent: Event; value: unknown } | undefined;
    component.onChange.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { originalEvent: new Event('change'), value: 'test' };
    component.handleChange(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });

  it('should emit onFocus event', () => {
    let emittedEvent: Event | undefined;
    component.onFocus.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new Event('focus');
    component.handleFocus(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit onBlur event', () => {
    let emittedEvent: Event | undefined;
    component.onBlur.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = new Event('blur');
    component.handleBlur(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit onShow event', () => {
    let eventEmitted = false;
    component.onShow.subscribe(() => {
      eventEmitted = true;
    });

    component.handleShow();

    expect(eventEmitted).toBe(true);
  });

  it('should emit onHide event', () => {
    let eventEmitted = false;
    component.onHide.subscribe(() => {
      eventEmitted = true;
    });

    component.handleHide();

    expect(eventEmitted).toBe(true);
  });

  it('should emit onFilter event', () => {
    let emittedEvent: { originalEvent: Event; filter: string } | undefined;
    component.onFilter.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { originalEvent: new Event('filter'), filter: 'test' };
    component.handleFilter(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });

  it('should emit onClear event', () => {
    let eventEmitted = false;
    component.onClear.subscribe(() => {
      eventEmitted = true;
    });

    component.handleClear();

    expect(eventEmitted).toBe(true);
  });

  it('should support ControlValueAccessor writeValue', () => {
    component.writeValue('new value');
    expect(component.value()).toBe('new value');
  });

  it('should register onChange callback', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);

    component.value.set('test');

    // Wait for effect to trigger
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith('test');
  });

  it('should register onTouched callback', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouchedSpy);

    const mockEvent = new FocusEvent('blur');
    component.handleBlur(mockEvent);

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should enable filter', () => {
    fixture.componentRef.setInput('filter', true);
    fixture.detectChanges();
    expect(component.filter()).toBe(true);
  });

  it('should show clear button', () => {
    fixture.componentRef.setInput('showClear', true);
    fixture.detectChanges();
    expect(component.showClear()).toBe(true);
  });

  it('should handle loading state', () => {
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();
    expect(component.loading()).toBe(true);
  });

  it('should handle invalid state', () => {
    fixture.componentRef.setInput('invalid', true);
    fixture.detectChanges();
    expect(component.invalid()).toBe(true);
  });

  it('should handle editable mode', () => {
    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    expect(component.editable()).toBe(true);
  });

  it('should handle group mode', () => {
    fixture.componentRef.setInput('group', true);
    fixture.detectChanges();
    expect(component.group()).toBe(true);
  });

  it('should handle virtual scroll', () => {
    fixture.componentRef.setInput('virtualScroll', true);
    fixture.detectChanges();
    expect(component.virtualScroll()).toBe(true);
  });
});

