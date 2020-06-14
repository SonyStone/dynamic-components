import { ChangeDetectorRef, Inject, Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Updatetable } from './abstract.context';
import { DATA_INJECTOR, DataInjectorGetter } from './data';
import { switchToObservable } from './utils/switch-to-observable';

@Pipe({
  name: 'getData',
  pure: false,
})
export class GetDataPipe<C> implements PipeTransform, OnDestroy, Updatetable<C> {

  private selector: string | undefined;
  private selectorSubject = new Subject<string>();

  private context: C | undefined;

  private subscription = this.selectorSubject
    .pipe(
      this.getDataInjector(this.injector),
      switchToObservable(),
      map((obj) => obj?.context$ || undefined),
      switchToObservable(),
    )
    .subscribe((context) => {
      this.update(context);
    })

  constructor(
    @Inject(DATA_INJECTOR) private getDataInjector: DataInjectorGetter<C>,
    private injector: Injector,
    private cd: ChangeDetectorRef,
  ) {}

  transform(selector: string): any {

    if (!this.selector) {

      if (typeof selector === 'string') {
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
