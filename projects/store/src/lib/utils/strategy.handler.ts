import { Injectable, OnDestroy } from '@angular/core';

import { AsyncLike, DisposebleLike, selectStrategy, SubscriptionStrategy } from './strategies';

@Injectable()
export class StrategyHandler<T> implements OnDestroy {

  private subscription: DisposebleLike<T> | undefined;
  private strategy: SubscriptionStrategy<T> | undefined;

  ngOnDestroy(): void {
    this.dispose();
  }

  handleContext(
    contextAsync: AsyncLike<T> | undefined,
    updateLatestValue: (value: T) => any,
  ): void {
    this.dispose();

    this.strategy = selectStrategy(contextAsync);
    this.subscription = this.strategy.createSubscription(
      contextAsync,
      updateLatestValue,
    );
  }

  dispose() {
    if (this.strategy && this.subscription) {
      this.strategy.dispose(this.subscription);
      this.strategy = null;
      this.subscription = null;
    }
  }

}
