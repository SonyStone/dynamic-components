import { Injector, Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { DataContextStore } from './get-data.directive';
import { StrategyHandler } from './utils/strategy.handler';
import { AbstractContext, Updatetable } from './view-context.service';

@Pipe({
  name: 'getData',
  pure: false,
})
export class GetDataPipe<T> implements PipeTransform, OnDestroy, Updatetable<T> {

  private strategyHandler = new StrategyHandler<AbstractContext<T>>();

  private latestValue: AbstractContext<T> | null = null;

  private selector: string;

  constructor(
    private injector: Injector,
    private data: DataContextStore,
    private cd: ChangeDetectorRef,
  ) {}

  transform(selector: string): any {

    console.log(`transform`, selector, this.latestValue);

    if (!this.selector) {
      if (typeof selector === 'string') {
        this.selector = selector;
        const contextAsync = this.data.get<T>(selector, this.injector);

        if (contextAsync) {
          this.strategyHandler.handleContext(
            contextAsync,
            (context) => {
              context.set(this);
              this.updateLatestValue(context)
            },
          )
        } else {
          this.dispose();
        }
      }

      return this.latestValue;
    }

    if (selector !== this.selector) {
      this.dispose();
      return this.transform(selector);
    }

    return this.latestValue;
  }

  update(context: AbstractContext<T>): void {
    this.updateLatestValue(context);
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private dispose(): void {
    this.strategyHandler.dispose();
    this.latestValue?.remove(this);
    this.latestValue = null;
    this.selector = null;
  }

  private updateLatestValue(value: AbstractContext<T>): void {
    this.latestValue = value;
    this.cd.markForCheck();
  }
}