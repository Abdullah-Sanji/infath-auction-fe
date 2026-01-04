import { Component, input, output, computed, InputSignal, OutputEmitterRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PageState {
  page: number;
  first: number;
  rows: number;
  pageCount: number;
}

@Component({
  selector: 'lib-paginator',
  imports: [CommonModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  // Input properties
  totalRecords: InputSignal<number> = input<number>(0);
  rows: InputSignal<number> = input<number>(10);
  first: InputSignal<number> = input<number>(0);
  pageLinkSize: InputSignal<number> = input<number>(3);
  showFirstLastIcon: InputSignal<boolean> = input<boolean>(true);
  alwaysShow: InputSignal<boolean> = input<boolean>(true);
  size: InputSignal<'small' | 'medium' | 'large'> = input<'small' | 'medium' | 'large'>('large');
  rtl: InputSignal<boolean> = input<boolean>(true);

  // Output events
  onPageChange: OutputEmitterRef<PageState> = output<PageState>();

  // Computed properties
  pageCount = computed(() => {
    const total = this.totalRecords();
    const rowsPerPage = this.rows();
    return Math.ceil(total / rowsPerPage) || 0;
  });

  currentPage = computed(() => {
    const firstRecord = this.first();
    const rowsPerPage = this.rows();
    return Math.floor(firstRecord / rowsPerPage);
  });

  pageLinks = computed(() => {
    const current = this.currentPage();
    const total = this.pageCount();
    const linkSize = this.pageLinkSize();

    if (total === 0) return [];

    const pages: (number | 'ellipsis')[] = [];
    const half = Math.floor(linkSize / 2);

    let start = Math.max(0, current - half);
    let end = Math.min(total - 1, start + linkSize - 1);

    // Adjust start if we're near the end
    if (end - start < linkSize - 1) {
      start = Math.max(0, end - linkSize + 1);
    }

    // Always show first page
    if (start > 0) {
      pages.push(0);
      if (start > 1) {
        pages.push('ellipsis');
      }
    }

    // Show middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Always show last page
    if (end < total - 1) {
      if (end < total - 2) {
        pages.push('ellipsis');
      }
      pages.push(total - 1);
    }

    return pages;
  });

  isFirstPage = computed(() => this.currentPage() === 0);
  isLastPage = computed(() => this.currentPage() >= this.pageCount() - 1);

  changePage(page: number): void {
    if (page < 0 || page >= this.pageCount()) return;
    if (page === this.currentPage()) return;

    const first = page * this.rows();
    this.onPageChange.emit({
      page,
      first,
      rows: this.rows(),
      pageCount: this.pageCount()
    });
  }

  changePageToFirst(): void {
    if (!this.isFirstPage()) {
      this.changePage(0);
    }
  }

  changePageToPrev(): void {
    if (!this.isFirstPage()) {
      this.changePage(this.currentPage() - 1);
    }
  }

  changePageToNext(): void {
    if (!this.isLastPage()) {
      this.changePage(this.currentPage() + 1);
    }
  }

  changePageToLast(): void {
    if (!this.isLastPage()) {
      this.changePage(this.pageCount() - 1);
    }
  }

  isCurrentPage(page: number | 'ellipsis'): boolean {
    return typeof page === 'number' && page === this.currentPage();
  }

  isEllipsis(page: number | 'ellipsis'): boolean {
    return page === 'ellipsis';
  }

  getPageNumber(page: number | 'ellipsis'): number {
    return typeof page === 'number' ? page + 1 : 0;
  }

  onPageClick(page: number | 'ellipsis'): void {
    if (typeof page === 'number') {
      this.changePage(page);
    }
  }
}

