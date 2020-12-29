import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { ConnectableObservable } from 'rxjs';
import { map, multicast } from 'rxjs/operators';

import { PaginatorContext } from './paginator.context';

type PageEvent = Pick<PaginatorContext, 'pageIndex' | 'pageSize' | 'length' | 'previousPageIndex'>;

@Component({
  selector: 'paginator',
  templateUrl: 'paginator.component.html',
  styleUrls: ['paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    PaginatorContext,
  ],
})
export class PaginatorComponent implements OnDestroy {

  @Input() set pageIndex(value: string | number) {
    this.paginatorContext.setPageIndex(value);
  }

  @Input() set length(value: string | number) {
    this.paginatorContext.setLength(value);
  }

  @Input() set pageSize(value: string | number) {
    this.paginatorContext.setPageSize(value);
  }

  @Input() set pageSizeOptions(value: readonly number[]) {
    this.paginatorContext.setPageSizeOptions(value);
  }

  @Output() readonly page = this.paginatorContext.context$.pipe(
    map(({ pageIndex, pageSize, length, previousPageIndex }) => ({ pageIndex, pageSize, length, previousPageIndex })),
    multicast(new EventEmitter<PageEvent>()),
  ) as ConnectableObservable<PageEvent>;

  private subscription = this.page.connect();

  constructor(
    public paginatorContext: PaginatorContext,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
