import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dialog } from './dialog';

describe('Dialog', () => {
  let component: Dialog;
  let fixture: ComponentFixture<Dialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dialog],
    }).compileComponents();

    fixture = TestBed.createComponent(Dialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    component.open();
    expect(component.visible()).toBe(true);
  });

  it('should close dialog', () => {
    component.open();
    component.close();
    expect(component.visible()).toBe(false);
  });

  it('should emit onShow event', () => {
    spyOn(component.onShow, 'emit');
    component.handleShow();
    expect(component.onShow.emit).toHaveBeenCalled();
  });

  it('should emit onHide event', () => {
    spyOn(component.onHide, 'emit');
    component.handleHide();
    expect(component.onHide.emit).toHaveBeenCalled();
  });
});

