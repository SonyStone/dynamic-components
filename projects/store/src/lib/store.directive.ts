import { Directive, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { isObservable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AsyncLike, switchToObservable } from './utils/switch-to-observable';
import { ViewContextHandler } from './view-context.service';

// tslint:disable:no-input-rename

@Directive({
  selector: '[store]',
  providers: [
    ViewContextHandler,
  ],
})
export class StoreDirective<C> implements OnChanges, OnDestroy {

  @Input('storeFrom') selector: AsyncLike<C> | undefined;
  private selectorSubject = new Subject<AsyncLike<C> | undefined>();

  private subscription = this.selectorSubject
    .pipe(
      tap((v) => console.log(`log-name 1`, isObservable(v))),
      switchToObservable(),
      tap((v) => console.log(`log-name 2`, v)),
    )
    .subscribe((context) => {
      this.viewContextHandler.update(context);
    });

  constructor(
    private viewContextHandler: ViewContextHandler<C>,
  ) {}

  ngOnChanges({ selector }: SimpleChanges): void {
    if (selector && selector.currentValue !== selector.previousValue) {

      this.selectorSubject.next(this.selector);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.viewContextHandler.clear();
  }
}
