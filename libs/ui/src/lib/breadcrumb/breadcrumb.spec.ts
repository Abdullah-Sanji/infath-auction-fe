import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Breadcrumb } from './breadcrumb';
import { MenuItem } from 'primeng/api';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Breadcrumb],
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set model', () => {
    const items: MenuItem[] = [
      { label: 'Home' },
      { label: 'Products' },
    ];
    component.model.set(items);
    fixture.detectChanges();
    expect(component.model().length).toBe(2);
  });

  it('should set home item', () => {
    const homeItem: MenuItem = { label: 'Home', icon: 'pi pi-home' };
    component.home.set(homeItem);
    fixture.detectChanges();
    expect(component.home()?.label).toBe('Home');
  });
});

