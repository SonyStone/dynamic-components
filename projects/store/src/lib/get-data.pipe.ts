import { ChangeDetectorRef, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AbstractContext, Updatetable } from './abstract.context';
import { switchToObservable } from './utils/switch-to-observable';

@Pipe({
  name: 'getData',
  pure: false,
})
export class GetDataPipe<C> implements PipeTransform, OnDestroy, Updatetable<C> {

  private selector: AbstractContext<C> | undefined;
  private selectorSubject = new Subject<AbstractContext<C>>();

  private context: C | undefined;

  private subscription = this.selectorSubject
    .pipe(
      map((obj) => obj?.context$ || undefined),
      switchToObservable(),
    )
    .subscribe((context) => {
      this.update(context);
    });

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  transform(selector: AbstractContext<C> | undefined): any {

    if (!this.selector) {

      if (selector?.context$) {
        this.selector = selector;

        this.selectorSubject.next(this.selector);
      }

      return this.context;
    }

    if (this.selector !== selector) {

      this.selector = null;

      return this.transform(selector);
    }

    return this.context;
  }

  update(context: C): void {
    this.context = context;
    this.cd.markForCheck();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
