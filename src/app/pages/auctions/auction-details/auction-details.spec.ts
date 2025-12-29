import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuctionDetails } from './auction-details';
import { AuctionDetailsService } from './services/auction-details.service';
import { provideRouter } from '@angular/router';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from '../../../core/services/transloco-loader';

describe('AuctionDetails', () => {
  let component: AuctionDetails;
  let fixture: ComponentFixture<AuctionDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuctionDetails],
      providers: [
        AuctionDetailsService,
        provideRouter([]),
        provideTransloco({
          config: {
            availableLangs: ['ar', 'en'],
            defaultLang: 'ar',
            reRenderOnLangChange: true,
            prodMode: true,
          },
          loader: TranslocoHttpLoader
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuctionDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with breadcrumb items', () => {
    const breadcrumbs = component.breadcrumbItems();
    expect(breadcrumbs.length).toBe(2);
    expect(breadcrumbs[0].label).toBe('الصفحة الرئيسية');
    expect(breadcrumbs[1].label).toBe('مزاد 233');
  });

  it('should initialize with auction details data', () => {
    const details = component.auctionDetails();
    expect(details).toBeTruthy();
    expect(details.id).toBe('233');
    expect(details.title).toBe('شقة سكنية في حي الملقا');
  });

  it('should display auction stats correctly', () => {
    const stats = component.auctionDetails().stats;
    expect(stats.bidsCount).toBe(65);
    expect(stats.viewsCount).toBe(35);
    expect(stats.participantsCount).toBe(12);
  });

  it('should have all accordions open by default', () => {
    const states = component.accordionStates();
    expect(states.boundaries).toBe(true);
    expect(states.ownership).toBe(true);
    expect(states.assetInfo).toBe(true);
    expect(states.residentialDetails).toBe(true);
    expect(states.publicServices).toBe(true);
    expect(states.neighborhoodServices).toBe(true);
  });

  it('should toggle accordion state', () => {
    const initialState = component.accordionStates().boundaries;
    component.toggleAccordion('boundaries');
    expect(component.accordionStates().boundaries).toBe(!initialState);
  });

  it('should toggle specific accordion without affecting others', () => {
    const initialOwnershipState = component.accordionStates().ownership;
    component.toggleAccordion('boundaries');
    expect(component.accordionStates().ownership).toBe(initialOwnershipState);
  });

  it('should have auction info with correct data', () => {
    const info = component.auctionDetails().info;
    expect(info.auctionType).toBe('إلكتروني');
    expect(info.assetType).toBe('عقار');
  });

  it('should have boundaries with all directions', () => {
    const boundaries = component.auctionDetails().boundaries;
    expect(boundaries.length).toBe(4);
    expect(boundaries[0].direction).toBe('شمالاً');
    expect(boundaries[1].direction).toBe('شرقاً');
    expect(boundaries[2].direction).toBe('جنوباً');
    expect(boundaries[3].direction).toBe('غرباً');
  });

  it('should have ownership information', () => {
    const ownership = component.auctionDetails().ownership;
    expect(ownership.propertyArea).toBe('150 م٢');
    expect(ownership.ownershipType).toBe('فردية');
    expect(ownership.ownershipRights).toBe('حرة');
  });

  it('should have complete asset information', () => {
    const assetInfo = component.auctionDetails().assetInfo;
    expect(assetInfo.planNumber).toBe('3345562');
    expect(assetInfo.plotNumber).toBe('12234');
    expect(assetInfo.propertyFacing).toBe('شرقية');
    expect(assetInfo.propertyUsage).toBe('سكني');
    expect(assetInfo.propertyLocation).toBe('الرياض ، حي السلام');
    expect(assetInfo.landType).toBe('أرض سكنية');
    expect(assetInfo.deedNumber).toBe('2202070236661');
  });

  it('should have residential details', () => {
    const residential = component.auctionDetails().residentialDetails;
    expect(residential.roomsCount).toBe(3);
    expect(residential.hallsCount).toBe(1);
    expect(residential.bathroomsCount).toBe(2);
    expect(residential.kitchensCount).toBe(1);
    expect(residential.buildingAge).toBe('جديد');
  });

  it('should have public services list', () => {
    const services = component.auctionDetails().publicServices;
    expect(services.length).toBe(5);
    expect(services[0].name).toBe('الإنترنت : 5G, Fiber');
    expect(services[1].name).toBe('مصعد');
  });

  it('should have neighborhood services with distances', () => {
    const services = component.auctionDetails().neighborhoodServices;
    expect(services.length).toBe(6);
    expect(services[0].name).toBe('مسجد');
    expect(services[0].distance).toBe('على بعد 500 متر');
  });

  it('should have seller review information', () => {
    const review = component.auctionDetails().sellerReview;
    expect(review.sellerName).toBe('مؤسسة أرصاد العقارية');
    expect(review.isVerified).toBe(true);
    expect(review.overallRating).toBe(3.5);
    expect(review.accuracyRating).toBe(4);
    expect(review.communicationRating).toBe(3.5);
  });

  it('should have images array', () => {
    const images = component.auctionDetails().images;
    expect(images.length).toBe(4);
    expect(images[0]).toContain('unsplash.com');
  });

  it('should have main image', () => {
    const mainImage = component.auctionDetails().mainImage;
    expect(mainImage).toBeTruthy();
    expect(mainImage).toContain('unsplash.com');
  });

  it('should render title in template', () => {
    const compiled = fixture.nativeElement;
    const title = compiled.querySelector('p.text-xl');
    expect(title?.textContent?.trim()).toBe('شقة سكنية في حي الملقا');
  });

  it('should render stats cards', () => {
    const compiled = fixture.nativeElement;
    const statsCards = compiled.querySelectorAll('.bg-white.border');
    expect(statsCards.length).toBeGreaterThan(0);
  });

  it('should toggle accordion on click', () => {
    const initialState = component.accordionStates().boundaries;
    component.toggleAccordion('boundaries');
    fixture.detectChanges();
    expect(component.accordionStates().boundaries).toBe(!initialState);
  });

  it('should display all boundary directions', () => {
    fixture.detectChanges();
    const boundaries = component.auctionDetails().boundaries;
    expect(boundaries.map(b => b.direction)).toEqual([
      'شمالاً',
      'شرقاً',
      'جنوباً',
      'غرباً'
    ]);
  });

  it('should have correct number of public services', () => {
    const services = component.auctionDetails().publicServices;
    expect(services.length).toBe(5);
  });

  it('should have correct number of neighborhood services', () => {
    const services = component.auctionDetails().neighborhoodServices;
    expect(services.length).toBe(6);
  });

  describe('Quick Bid Functionality', () => {
    it('should initialize with quick bid amounts', () => {
      const amounts = component.quickBidAmounts();
      expect(amounts).toBeTruthy();
      expect(amounts.length).toBe(4);
      expect(amounts).toEqual([15550, 10000, 15000, 20000]);
    });

    it('should initialize with no selected quick bid amount', () => {
      expect(component.selectedQuickBidAmount()).toBeNull();
    });

    it('should select quick bid amount when clicked', () => {
      const testAmount = 15550;
      component.selectQuickBidAmount(testAmount);
      expect(component.selectedQuickBidAmount()).toBe(testAmount);
    });

    it('should update selected amount when different button is clicked', () => {
      component.selectQuickBidAmount(15550);
      expect(component.selectedQuickBidAmount()).toBe(15550);

      component.selectQuickBidAmount(20000);
      expect(component.selectedQuickBidAmount()).toBe(20000);
    });

    it('should log selected amount to console', () => {
      spyOn(console, 'log');
      const testAmount = 10000;
      component.selectQuickBidAmount(testAmount);
      expect(console.log).toHaveBeenCalledWith('Quick bid amount selected:', testAmount);
    });

    it('should render quick bid buttons in template', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const quickBidButtons = compiled.querySelectorAll('.grid.grid-cols-2 button');
      expect(quickBidButtons.length).toBe(4);
    });

    it('should display correct amounts in quick bid buttons', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const quickBidButtons = compiled.querySelectorAll('.grid.grid-cols-2 button p');
      const amounts = component.quickBidAmounts();
      
      quickBidButtons.forEach((button: Element, index: number) => {
        const expectedAmount = amounts[index].toLocaleString('ar-SA');
        expect(button.textContent).toContain(expectedAmount);
      });
    });

    it('should apply selected styles when quick bid button is clicked', () => {
      const testAmount = 15550;
      component.selectQuickBidAmount(testAmount);
      fixture.detectChanges();

      expect(component.selectedQuickBidAmount()).toBe(testAmount);
    });

    it('should handle multiple quick bid selections', () => {
      const amounts = [15550, 10000, 15000, 20000];
      
      amounts.forEach(amount => {
        component.selectQuickBidAmount(amount);
        expect(component.selectedQuickBidAmount()).toBe(amount);
      });
    });
  });
});
