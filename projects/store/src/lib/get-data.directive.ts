import { Directive, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractContext } from './abstract.context';
import { switchToObservable } from './utils/switch-to-observable';
import { ViewContextHandler } from './view-context.service';

// tslint:disable:no-input-rename

@Directive({
  selector: '[getData]',
  providers: [
    ViewContextHandler,
  ],
})
export class GetDataDirective<C> implements OnChanges, OnDestroy {

  @Input('getDataFrom') selector: AbstractContext<C> | undefined;
  private selectorSubject = new Subject<AbstractContext<C>>();

  private subscription = this.selectorSubject
    .pipe(
      map((obj) => obj?.context$ || undefined),
      switchToObservable(),
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
    this.viewContextHandler.clear();
    this.subscription.unsubscribe();
  }
}
