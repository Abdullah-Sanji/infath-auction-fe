import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionsFilter } from './auctions-filter';

describe('AuctionsFilter', () => {
  let component: AuctionsFilter;
  let fixture: ComponentFixture<AuctionsFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionsFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuctionsFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
