import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { ProfileMenuSectionComponent } from './profile-menu-section';
import { ProfileMenuSection as ProfileMenuSectionType } from '../../interfaces/profile.interface';

describe('ProfileMenuSectionComponent', () => {
  let component: ProfileMenuSectionComponent;
  let fixture: ComponentFixture<ProfileMenuSectionComponent>;

  const mockMenuSection: ProfileMenuSectionType = {
    title: 'profile.menu.account',
    items: [
      {
        id: 'personal-info',
        title: 'profile.menu.personalInfo',
        description: 'profile.menu.personalInfoDesc',
        icon: 'pi pi-user',
        route: '/profile/personal-info',
        active: true
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProfileMenuSectionComponent,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'en'
          }
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileMenuSectionComponent);
    component = fixture.componentInstance;
    // Set input signal value using the component's input signal
    fixture.componentRef.setInput('menuSection', mockMenuSection);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit menu item click event', () => {
    spyOn(component.onMenuItemClick, 'emit');

    const item = mockMenuSection.items[0];
    component.handleItemClick(item);

    expect(component.onMenuItemClick.emit).toHaveBeenCalledWith({
      itemId: item.id,
      route: item.route
    });
  });

  it('should display menu section title', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('profile.menu.account');
  });

  it('should display menu items', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('profile.menu.personalInfo');
  });
});

