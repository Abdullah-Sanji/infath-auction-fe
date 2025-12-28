import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { Breadcrumb, BreadcrumbItem } from './breadcrumb';

describe('Breadcrumb', () => {
  let component: Breadcrumb;
  let fixture: ComponentFixture<Breadcrumb>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        Breadcrumb,
        RouterTestingModule,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'en'
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Breadcrumb);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display breadcrumb items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: ['/'], translationKey: 'nav.home' },
      { label: 'Auction 233' }
    ];

    component.items.set(items);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const links = compiled.querySelectorAll('.breadcrumb-link');
    const current = compiled.querySelectorAll('.breadcrumb-current');

    expect(links.length).toBe(1);
    expect(current.length).toBe(1);
  });

  it('should render separators between items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', route: ['/'] },
      { label: 'Auctions', route: ['/auctions'] },
      { label: 'Details' }
    ];

    component.items.set(items);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const separators = compiled.querySelectorAll('.breadcrumb-separator');

    expect(separators.length).toBe(2);
  });
});

