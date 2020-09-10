import { Directive, OnDestroy } from '@angular/core';
import { ViewContextHandler } from 'store';

import { DynamicCounter } from './dynamic-counter';



@Directive({
  selector: '[appDynamicCounter]',
  providers: [
    ViewContextHandler,
    DynamicCounter,
  ],
})
export class DynamicCounterDirective implements OnDestroy {

  private subscription = this.counter.store.state$.subscribe((context) => {
    this.viewContextHandler.update(context);
  });

  constructor(
    private counter: DynamicCounter,
    private viewContextHandler: ViewContextHandler<DynamicCounter>,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.viewContextHandler.ngOnDestroy();
  }
}
