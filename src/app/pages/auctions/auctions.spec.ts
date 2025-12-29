import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auctions } from './auctions';
import { provideRouter } from '@angular/router';
import { PageState } from '@shared/components/ui/paginator/paginator';

describe('Auctions', () => {
  let component: Auctions;
  let fixture: ComponentFixture<Auctions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auctions],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Auctions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with breadcrumb items', () => {
      const breadcrumbs = component.breadcrumbItems();
      expect(breadcrumbs.length).toBe(2);
      expect(breadcrumbs[0].label).toBe('الصفحة الرئيسية');
      expect(breadcrumbs[1].label).toBe('مزادات العقارات');
    });

    it('should initialize with auctions filter data', () => {
      const filterData = component.auctionsFilterData();
      expect(filterData).toBeTruthy();
      expect(filterData?.length).toBe(5);
    });

    it('should have all filter categories', () => {
      const filterData = component.auctionsFilterData();
      const titles = filterData?.map(f => f.title);
      expect(titles).toContain('جميع المزادات');
      expect(titles).toContain('السكنية');
      expect(titles).toContain('الزراعية');
      expect(titles).toContain('التجارية');
      expect(titles).toContain('الصناعية');
    });

    it('should initialize with all auctions data', () => {
      const allAuctions = component.allAuctions();
      expect(allAuctions.length).toBe(12);
    });
  });

  describe('Pagination', () => {
    it('should initialize pagination with default values', () => {
      expect(component.first()).toBe(0);
      expect(component.rows()).toBe(8);
    });

    it('should compute paginated auctions correctly', () => {
      const auctions = component.auctions();
      expect(auctions.length).toBe(8);
      expect(auctions[0].id).toBe(1);
    });

    it('should show first page of auctions', () => {
      component.first.set(0);
      const auctions = component.auctions();
      expect(auctions.length).toBe(8);
      expect(auctions[0].id).toBe(1);
      expect(auctions[7].id).toBe(8);
    });

    it('should show second page of auctions', () => {
      component.first.set(8);
      const auctions = component.auctions();
      expect(auctions.length).toBe(4);
      expect(auctions[0].id).toBe(9);
      expect(auctions[3].id).toBe(12);
    });

    it('should handle page change event', () => {
      const pageState: PageState = {
        page: 1,
        first: 8,
        rows: 8,
        pageCount: 2
      };

      spyOn(window, 'scrollTo');
      component.onPageChange(pageState);

      expect(component.first()).toBe(8);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
    });

    it('should update displayed auctions on page change', () => {
      // First page
      let auctions = component.auctions();
      expect(auctions[0].id).toBe(1);

      // Change to second page
      const pageState: PageState = {
        page: 1,
        first: 8,
        rows: 8,
        pageCount: 2
      };
      component.onPageChange(pageState);

      // Second page
      auctions = component.auctions();
      expect(auctions[0].id).toBe(9);
    });

    it('should handle empty page gracefully', () => {
      component.first.set(100);
      const auctions = component.auctions();
      expect(auctions.length).toBe(0);
    });

    it('should calculate correct number of pages', () => {
      const totalRecords = component.allAuctions().length;
      const rows = component.rows();
      const expectedPages = Math.ceil(totalRecords / rows);
      expect(expectedPages).toBe(2);
    });
  });

  describe('Filter functionality', () => {
    it('should handle filter change', () => {
      spyOn(console, 'log');
      const filterItem = component.auctionsFilterData()?.[0];
      
      if (filterItem) {
        component.onFilterChange(filterItem);
        expect(console.log).toHaveBeenCalledWith('Filter changed:', filterItem);
      }
    });

    it('should log filter selection', () => {
      spyOn(console, 'log');
      const residentialFilter = component.auctionsFilterData()?.find(f => f.id === 'residential-auctions');
      
      if (residentialFilter) {
        component.onFilterChange(residentialFilter);
        expect(console.log).toHaveBeenCalledWith('Filter changed:', residentialFilter);
      }
    });
  });

  describe('Auction interactions', () => {
    it('should handle auction click', () => {
      spyOn(console, 'log');
      const auction = component.auctions()[0];
      
      component.onAuctionClick(auction);
      expect(console.log).toHaveBeenCalledWith('Auction clicked:', auction);
    });

    it('should toggle favorite status', () => {
      const auction = component.allAuctions()[0];
      const initialFavoriteStatus = auction.isFavorited;
      
      component.onFavoriteClick(auction);
      
      const updatedAuction = component.allAuctions().find(a => a.id === auction.id);
      expect(updatedAuction?.isFavorited).toBe(!initialFavoriteStatus);
    });

    it('should persist favorite status across pages', () => {
      // Favorite an auction on first page
      const firstAuction = component.allAuctions()[0];
      component.onFavoriteClick(firstAuction);
      
      const favorited = component.allAuctions()[0].isFavorited;
      
      // Navigate to second page
      component.first.set(8);
      
      // Navigate back to first page
      component.first.set(0);
      
      // Check favorite status is still there
      const stillFavorited = component.allAuctions()[0].isFavorited;
      expect(stillFavorited).toBe(favorited);
    });

    it('should update correct auction when favoriting', () => {
      const auction = component.allAuctions()[2];
      const otherAuction = component.allAuctions()[0];
      
      const initialOtherStatus = otherAuction.isFavorited;
      
      component.onFavoriteClick(auction);
      
      const updatedOther = component.allAuctions().find(a => a.id === otherAuction.id);
      expect(updatedOther?.isFavorited).toBe(initialOtherStatus);
    });
  });

  describe('Template rendering', () => {
    it('should render breadcrumb', () => {
      const compiled = fixture.nativeElement;
      const breadcrumb = compiled.querySelector('app-breadcrumb');
      expect(breadcrumb).toBeTruthy();
    });

    it('should render page title', () => {
      const compiled = fixture.nativeElement;
      const title = compiled.querySelector('p.text-2xl');
      expect(title?.textContent).toContain('مزادات العقارات');
    });

    it('should render auctions filter', () => {
      const compiled = fixture.nativeElement;
      const filter = compiled.querySelector('app-auctions-filter');
      expect(filter).toBeTruthy();
    });

    it('should render auction cards', () => {
      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('app-auction-card');
      expect(cards.length).toBe(8);
    });

    it('should render paginator', () => {
      const compiled = fixture.nativeElement;
      const paginator = compiled.querySelector('lib-paginator');
      expect(paginator).toBeTruthy();
    });

    it('should render correct number of cards per page', () => {
      fixture.detectChanges();
      const compiled = fixture.nativeElement;
      const cards = compiled.querySelectorAll('app-auction-card');
      expect(cards.length).toBe(component.rows());
    });
  });

  describe('Data integrity', () => {
    it('should have unique auction IDs', () => {
      const allAuctions = component.allAuctions();
      const ids = allAuctions.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have valid auction data', () => {
      const allAuctions = component.allAuctions();
      allAuctions.forEach(auction => {
        expect(auction.id).toBeTruthy();
        expect(auction.title).toBeTruthy();
        expect(auction.highestBid).toBeGreaterThan(0);
        expect(auction.endDate).toBeInstanceOf(Date);
        expect(auction.imageUrl).toBeTruthy();
        expect(auction.participantsCount).toBeGreaterThanOrEqual(0);
        expect(auction.timeRemaining).toBeTruthy();
      });
    });

    it('should have boolean flags', () => {
      const allAuctions = component.allAuctions();
      allAuctions.forEach(auction => {
        expect(typeof auction.isLive).toBe('boolean');
        expect(typeof auction.isFavorited).toBe('boolean');
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty auctions list', () => {
      component.allAuctions.set([]);
      const auctions = component.auctions();
      expect(auctions.length).toBe(0);
    });

    it('should handle single auction', () => {
      const singleAuction = component.allAuctions()[0];
      component.allAuctions.set([singleAuction]);
      const auctions = component.auctions();
      expect(auctions.length).toBe(1);
    });

    it('should handle page beyond available data', () => {
      component.first.set(1000);
      const auctions = component.auctions();
      expect(auctions.length).toBe(0);
    });
  });
});

