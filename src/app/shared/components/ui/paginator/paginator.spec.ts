import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Paginator, PageState } from './paginator';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('Paginator', () => {
  let component: Paginator;
  let fixture: ComponentFixture<Paginator>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Paginator]
    }).compileComponents();

    fixture = TestBed.createComponent(Paginator);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pageCount computation', () => {
    it('should calculate page count correctly', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.pageCount()).toBe(10);
    });

    it('should handle zero total records', () => {
      fixture.componentRef.setInput('totalRecords', 0);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.pageCount()).toBe(0);
    });

    it('should round up for partial pages', () => {
      fixture.componentRef.setInput('totalRecords', 95);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.pageCount()).toBe(10);
    });
  });

  describe('currentPage computation', () => {
    it('should calculate current page correctly', () => {
      fixture.componentRef.setInput('first', 20);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.currentPage()).toBe(2);
    });

    it('should return 0 for first page', () => {
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.currentPage()).toBe(0);
    });
  });

  describe('pageLinks computation', () => {
    it('should generate page links correctly', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('pageLinkSize', 5);
      fixture.detectChanges();

      const links = component.pageLinks();
      expect(links.length).toBeGreaterThan(0);
      expect(links).toContain(0);
    });

    it('should include ellipsis for large page counts', () => {
      fixture.componentRef.setInput('totalRecords', 1000);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 50);
      fixture.componentRef.setInput('pageLinkSize', 5);
      fixture.detectChanges();

      const links = component.pageLinks();
      expect(links).toContain('ellipsis');
    });

    it('should show first and last pages', () => {
      fixture.componentRef.setInput('totalRecords', 1000);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 50);
      fixture.componentRef.setInput('pageLinkSize', 5);
      fixture.detectChanges();

      const links = component.pageLinks();
      expect(links[0]).toBe(0);
      expect(links[links.length - 1]).toBe(99);
    });
  });

  describe('isFirstPage computation', () => {
    it('should return true on first page', () => {
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.isFirstPage()).toBe(true);
    });

    it('should return false on other pages', () => {
      fixture.componentRef.setInput('first', 10);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.isFirstPage()).toBe(false);
    });
  });

  describe('isLastPage computation', () => {
    it('should return true on last page', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 90);
      fixture.detectChanges();

      expect(component.isLastPage()).toBe(true);
    });

    it('should return false on other pages', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      expect(component.isLastPage()).toBe(false);
    });
  });

  describe('changePage method', () => {
    it('should emit onPageChange event', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(2);
        expect(state.first).toBe(20);
        expect(state.rows).toBe(10);
        expect(state.pageCount).toBe(10);
        done();
      });

      component.changePage(2);
    });

    it('should not emit for invalid page numbers', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePage(-1);
      component.changePage(100);

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });

    it('should not emit for current page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 20);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePage(2);

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('changePageToFirst method', () => {
    it('should navigate to first page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 50);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(0);
        expect(state.first).toBe(0);
        done();
      });

      component.changePageToFirst();
    });

    it('should not emit when already on first page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePageToFirst();

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('changePageToPrev method', () => {
    it('should navigate to previous page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 20);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(1);
        expect(state.first).toBe(10);
        done();
      });

      component.changePageToPrev();
    });

    it('should not emit when on first page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePageToPrev();

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('changePageToNext method', () => {
    it('should navigate to next page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 20);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(3);
        expect(state.first).toBe(30);
        done();
      });

      component.changePageToNext();
    });

    it('should not emit when on last page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 90);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePageToNext();

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('changePageToLast method', () => {
    it('should navigate to last page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(9);
        expect(state.first).toBe(90);
        done();
      });

      component.changePageToLast();
    });

    it('should not emit when already on last page', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 90);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.changePageToLast();

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('isCurrentPage method', () => {
    it('should return true for current page', () => {
      fixture.componentRef.setInput('first', 20);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.isCurrentPage(2)).toBe(true);
    });

    it('should return false for other pages', () => {
      fixture.componentRef.setInput('first', 20);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.isCurrentPage(1)).toBe(false);
      expect(component.isCurrentPage(3)).toBe(false);
    });

    it('should return false for ellipsis', () => {
      fixture.componentRef.setInput('first', 20);
      fixture.componentRef.setInput('rows', 10);
      fixture.detectChanges();

      expect(component.isCurrentPage('ellipsis')).toBe(false);
    });
  });

  describe('isEllipsis method', () => {
    it('should return true for ellipsis', () => {
      expect(component.isEllipsis('ellipsis')).toBe(true);
    });

    it('should return false for page numbers', () => {
      expect(component.isEllipsis(1)).toBe(false);
      expect(component.isEllipsis(0)).toBe(false);
    });
  });

  describe('getPageNumber method', () => {
    it('should return page number plus one', () => {
      expect(component.getPageNumber(0)).toBe(1);
      expect(component.getPageNumber(5)).toBe(6);
      expect(component.getPageNumber(99)).toBe(100);
    });

    it('should return 0 for ellipsis', () => {
      expect(component.getPageNumber('ellipsis')).toBe(0);
    });
  });

  describe('onPageClick method', () => {
    it('should call changePage for number', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(3);
        done();
      });

      component.onPageClick(3);
    });

    it('should not call changePage for ellipsis', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      let emitted = false;
      component.onPageChange.subscribe(() => {
        emitted = true;
      });

      component.onPageClick('ellipsis');

      setTimeout(() => {
        expect(emitted).toBe(false);
        done();
      }, 100);
    });
  });

  describe('template rendering', () => {
    it('should render pagination controls', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render page numbers', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      const pageButtons = compiled.querySelectorAll('button[aria-label^="Page"]');
      expect(pageButtons.length).toBeGreaterThan(0);
    });

    it('should show current page indicator', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 20);
      fixture.detectChanges();

      const currentPageButton = compiled.querySelector('button[aria-current="page"]');
      expect(currentPageButton).toBeTruthy();
    });

    it('should disable first/prev buttons on first page', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button[disabled]');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should disable next/last buttons on last page', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 90);
      fixture.detectChanges();

      const buttons = compiled.querySelectorAll('button[disabled]');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should apply RTL layout when rtl is true', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('rtl', true);
      fixture.detectChanges();

      const container = compiled.querySelector('.flex-row-reverse');
      expect(container).toBeTruthy();
    });

    it('should apply LTR layout when rtl is false', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('rtl', false);
      fixture.detectChanges();

      const container = compiled.querySelector('.flex-row');
      expect(container).toBeTruthy();
    });

    it('should apply correct size classes for large', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const button = compiled.querySelector('button.w-10');
      expect(button).toBeTruthy();
    });

    it('should apply correct size classes for medium', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const button = compiled.querySelector('button.w-8');
      expect(button).toBeTruthy();
    });

    it('should apply correct size classes for small', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const button = compiled.querySelector('button.w-6');
      expect(button).toBeTruthy();
    });

    it('should hide first/last icons when showFirstLastIcon is false', () => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('showFirstLastIcon', false);
      fixture.detectChanges();

      const allButtons = compiled.querySelectorAll('button');
      // Should have fewer buttons without first/last
      expect(allButtons.length).toBeLessThan(10);
    });

    it('should show pagination when alwaysShow is true even with no records', () => {
      fixture.componentRef.setInput('totalRecords', 0);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.componentRef.setInput('alwaysShow', true);
      fixture.detectChanges();

      const container = compiled.querySelector('.flex');
      expect(container).toBeTruthy();
    });
  });

  describe('user interactions', () => {
    it('should handle click on page number', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBeGreaterThanOrEqual(0);
        done();
      });

      const pageButton = compiled.querySelector('button[aria-label="Page 3"]') as HTMLButtonElement;
      if (pageButton) {
        pageButton.click();
      } else {
        done();
      }
    });

    it('should handle click on next button', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 0);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(1);
        done();
      });

      const nextButton = compiled.querySelector('button[aria-label="Next Page"]') as HTMLButtonElement;
      nextButton?.click();
    });

    it('should handle click on previous button', (done) => {
      fixture.componentRef.setInput('totalRecords', 100);
      fixture.componentRef.setInput('rows', 10);
      fixture.componentRef.setInput('first', 20);
      fixture.detectChanges();

      component.onPageChange.subscribe((state: PageState) => {
        expect(state.page).toBe(1);
        done();
      });

      const prevButton = compiled.querySelector('button[aria-label="Previous Page"]') as HTMLButtonElement;
      prevButton?.click();
    });
  });
});

