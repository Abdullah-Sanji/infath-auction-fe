import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { PersonalInfo } from './personal-info';
import { ProfileService } from '../../services/profile.service';

describe('PersonalInfo', () => {
  let component: PersonalInfo;
  let fixture: ComponentFixture<PersonalInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PersonalInfo,
        TranslocoTestingModule.forRoot({
          langs: { en: {}, ar: {} },
          translocoConfig: {
            availableLangs: ['en', 'ar'],
            defaultLang: 'en'
          }
        })
      ],
      providers: [ProfileService]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

