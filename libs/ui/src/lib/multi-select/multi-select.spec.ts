import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MultiSelect } from './multi-select';
import { FormsModule } from '@angular/forms';

describe('MultiSelect', () => {
  let component: MultiSelect;
  let fixture: ComponentFixture<MultiSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiSelect, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MultiSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set value as array', () => {
    component.value.set(['option1', 'option2']);
    fixture.detectChanges();
    expect(component.value()).toEqual(['option1', 'option2']);
  });

  it('should handle options array', () => {
    const options = [
      { label: 'Option 1', value: 'opt1' },
      { label: 'Option 2', value: 'opt2' },
      { label: 'Option 3', value: 'opt3' },
    ];
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    expect(component.options()).toEqual(options);
  });

  it('should handle placeholder', () => {
    fixture.componentRef.setInput('placeholder', 'Choose multiple options');
    fixture.detectChanges();
    expect(component.placeholder()).toBe('Choose multiple options');
  });

  it('should be disabled when disabled input is true', () => {
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();
    expect(component.disabled()).toBe(true);
  });

  it('should emit onChange event', () => {
    let emittedEvent: { originalEvent: Event; value: unknown[]; itemValue?: unknown } | undefined;
    component.onChange.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = {
      originalEvent: new Event('change'),
      value: ['test1', 'test2'],
      itemValue: 'test2',
    };
    component.handleChange(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });

  it('should emit onFocus event', () => {
    let emittedEvent: unknown;
    component.onFocus.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { originalEvent: new Event('focus') };
    component.handleFocus(mockEvent);

    expect(emittedEvent).toBe(mockEvent);
  });

  it('should emit onBlur event', () => {
    let emittedEvent: unknown;
    component.onBlur.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { originalEvent: new Event('blur') };
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

  it('should emit onSelectAllChange event', () => {
    let emittedEvent: { originalEvent: Event; checked: boolean } | undefined;
    component.onSelectAllChange.subscribe((event) => {
      emittedEvent = event;
    });

    const mockEvent = { originalEvent: new Event('selectall'), checked: true };
    component.handleSelectAllChange(mockEvent);

    expect(emittedEvent).toEqual(mockEvent);
  });

  it('should support ControlValueAccessor writeValue', () => {
    component.writeValue(['val1', 'val2']);
    expect(component.value()).toEqual(['val1', 'val2']);
  });

  it('should register onChange callback', () => {
    const onChangeSpy = jasmine.createSpy('onChange');
    component.registerOnChange(onChangeSpy);

    component.value.set(['test']);

    // Wait for effect to trigger
    fixture.detectChanges();

    expect(onChangeSpy).toHaveBeenCalledWith(['test']);
  });

  it('should register onTouched callback', () => {
    const onTouchedSpy = jasmine.createSpy('onTouched');
    component.registerOnTouched(onTouchedSpy);

    const mockEvent = new FocusEvent('blur');
    component.handleBlur(mockEvent);

    expect(onTouchedSpy).toHaveBeenCalled();
  });

  it('should enable filter by default', () => {
    expect(component.filter()).toBe(true);
  });

  it('should show toggle all by default', () => {
    expect(component.showToggleAll()).toBe(true);
  });

  it('should show clear button when enabled', () => {
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

  it('should handle display mode', () => {
    fixture.componentRef.setInput('display', 'chip');
    fixture.detectChanges();
    expect(component.display()).toBe('chip');
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

  it('should handle maxSelectedLabels', () => {
    fixture.componentRef.setInput('maxSelectedLabels', 5);
    fixture.detectChanges();
    expect(component.maxSelectedLabels()).toBe(5);
  });

  it('should handle empty array writeValue', () => {
    component.writeValue([]);
    expect(component.value()).toEqual([]);
  });
});

