import { Injectable } from '@angular/core';
import { debounceTime, mapTo, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';
import { StoreService } from 'store';

const getRangeLabel = (pageIndex: number, pageSize: number, length: number) => {
  if (length === 0 || pageSize === 0) { return `0 of ${length}`; }
  length = Math.max(length, 0);
  const startIndex = pageIndex * pageSize;

  // If the start index exceeds the list length, do not try and fix the end index to the end.
  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `${startIndex + 1} – ${endIndex} of ${length}`;
};

const getHasNextPage = (pageIndex: number, pageSize: number, numberOfPages: number) => {
  const maxPageIndex = numberOfPages - 1;
  return pageIndex < maxPageIndex && pageSize !== 0;
};

const getHasPreviousPage = (pageIndex: number, pageSize: number) => {
  return pageIndex >= 1 && pageSize !== 0;
};

const getNumberOfPages = (pageSize: number, length: number) => {
  return (!pageSize)
    ? 0
    : Math.ceil(length / pageSize);
};

@Injectable()
export class PaginatorContext {
  $implicit = this;

  pageIndex = 0;
  previousPageIndex = undefined;
  pageSize = 50;
  pageSizeOptions = [50];
  length = 100;
  rangeLabel = '';
  hasPreviousPage = false;
  hasNextPage = false;
  numberOfPages = 0;

  store = new StoreService<PaginatorContext>(this, switchMap);

  context$ = this.store.state$.pipe(
    debounceTime(0),
    startWith(this),
    tap(() => {
      this.numberOfPages = getNumberOfPages(this.pageSize, this.length);
      this.hasPreviousPage = getHasPreviousPage(this.pageIndex, this.pageSize);
      this.hasNextPage = getHasNextPage(this.pageIndex, this.pageSize, this.numberOfPages);
      this.rangeLabel = getRangeLabel(this.pageIndex, this.pageSize, this.length);
    }),
    shareReplay(1),
  );

  readonly setPageIndex = (value: string | number) => {
    this.previousPageIndex = this.pageIndex;
    this.pageIndex = Number(value) || 0;
    this.store.action(mapTo(this));
  }

  readonly setPageSize = (value: string | number) => {
    this.pageSize = Number(value) || 0;
    this.store.action(mapTo(this));
  }

  readonly setLength = (value: string | number) => {
    this.length = Number(value) || 0;
    this.store.action(mapTo(this));
  }

  readonly setPageSizeOptions = (value: readonly number[]) => {
    this.pageSizeOptions = [...new Set<number>([...value, this.pageSize].sort((a, b) => a - b))];
    this.store.action(mapTo(this));
  }

  readonly firstPage = () => {
    if (this.hasPreviousPage) {
      this.setPageIndex(0);
    }
  }

  readonly previousPage = () => {
    if (this.hasPreviousPage) {
      this.setPageIndex(this.pageIndex - 1);
    }
  }

  readonly nextPage = () => {
    if (this.hasNextPage) {
      this.setPageIndex(this.pageIndex + 1);
    }
  }

  readonly lastPage = () => {
    if (this.hasNextPage) {
      this.setPageIndex(this.numberOfPages - 1);
    }
  }

  readonly changePageSize = (newPageSize: number) => {
    const startIndex = this.pageIndex * this.pageSize;
    this.setPageSize(newPageSize);
    this.setPageIndex(Math.floor(startIndex / newPageSize));
  }
}
