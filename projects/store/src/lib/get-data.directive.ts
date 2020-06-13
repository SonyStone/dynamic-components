import { Directive, Inject, Injector, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DATA_INJECTOR, DataInjectorGetter } from './data';
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

  @Input('getDataFrom') selector: string | undefined;
  private selectorSubject = new Subject<string>();

  private subscription = this.selectorSubject
    .pipe(
      this.getDataInjector(this.injector),
      switchToObservable(),
      map((obj) => obj?.context$ || undefined),
      switchToObservable(),
    )
    .subscribe((context) => {
      this.viewContextHandler.update(context);
    })

  constructor(
    @Inject(DATA_INJECTOR) private getDataInjector: DataInjectorGetter<C>,
    private injector: Injector,
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
