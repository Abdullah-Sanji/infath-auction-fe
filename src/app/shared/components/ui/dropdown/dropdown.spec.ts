import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Dropdown, DropdownOption, DropdownChangeEvent, DropdownFilterEvent } from './dropdown';

describe('Dropdown', () => {
  let component: Dropdown;
  let fixture: ComponentFixture<Dropdown>;

  const mockOptions: DropdownOption[] = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dropdown, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Dropdown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default selectedValue as null', () => {
    expect(component.selectedValue()).toBeNull();
  });

  it('should update selectedValue', () => {
    component.selectedValue.set('1');
    fixture.detectChanges();

    expect(component.selectedValue()).toBe('1');
  });

  it('should set options', () => {
    component.options.set(mockOptions);
    fixture.detectChanges();

    expect(component.options().length).toBe(3);
    expect(component.options()[0].label).toBe('Option 1');
  });

  it('should emit onChange event', () => {
    spyOn(component.onChange, 'emit');
    const mockEvent: DropdownChangeEvent = { value: '1', originalEvent: new Event('change') };

    component.onChange.emit(mockEvent);

    expect(component.onChange.emit).toHaveBeenCalledWith(mockEvent);
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

  it('should emit onShow event', () => {
    spyOn(component.onShow, 'emit');
    const mockEvent = new Event('show');

    component.onShow.emit(mockEvent);

    expect(component.onShow.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onHide event', () => {
    spyOn(component.onHide, 'emit');
    const mockEvent = new Event('hide');

    component.onHide.emit(mockEvent);

    expect(component.onHide.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should emit onFilter event', () => {
    spyOn(component.onFilter, 'emit');
    const mockEvent: DropdownFilterEvent = { filter: 'test', originalEvent: new Event('filter') };

    component.onFilter.emit(mockEvent);

    expect(component.onFilter.emit).toHaveBeenCalledWith(mockEvent);
  });

  it('should set disabled state', () => {
    component.disabled.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dropdown = compiled.querySelector('p-dropdown');
    expect(dropdown.getAttribute('ng-reflect-disabled')).toBe('true');
  });

  it('should set placeholder', () => {
    component.placeholder.set('Select an option');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dropdown = compiled.querySelector('p-dropdown');
    expect(dropdown.getAttribute('ng-reflect-placeholder')).toBe('Select an option');
  });

  it('should set filter', () => {
    component.filter.set(true);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const dropdown = compiled.querySelector('p-dropdown');
    expect(dropdown.getAttribute('ng-reflect-filter')).toBe('true');
  });

  it('should have default values', () => {
    expect(component.options()).toEqual([]);
    expect(component.optionLabel()).toBe('label');
    expect(component.optionValue()).toBe('value');
    expect(component.placeholder()).toBe('Select');
    expect(component.disabled()).toBe(false);
    expect(component.filter()).toBe(false);
    expect(component.showClear()).toBe(false);
  });
});
