import { EventEmitter } from '@angular/core';
import { isObservable, Observable, SubscriptionLike } from 'rxjs';

import { isPromise } from './is-promise';

export type AsyncLike<T> = Observable<T> | Promise<T> | T;
export type DisposebleLike<T> = SubscriptionLike | Promise<T> | T;

export interface SubscriptionStrategy<T> {

  createSubscription(
    async: AsyncLike<T>,
    updateLatestValue: (value: T) => any,
  ): DisposebleLike<T>;

  dispose(subscription: DisposebleLike<T>): void;
}

class ObservableStrategy<T = any> implements SubscriptionStrategy<T> {

  createSubscription(
    async: Observable<T>,
    updateLatestValue: (value: T) => any,
  ): SubscriptionLike {

    return async.subscribe({
      next: updateLatestValue,
      error: (e: any) => {
        throw e;
      }
    });

  }

  dispose(subscription: SubscriptionLike): void {
    subscription.unsubscribe();
  }
}

const observableStrategy = new ObservableStrategy();

class PromiseStrategy<T = any> implements SubscriptionStrategy<T> {

  createSubscription(
    async: Promise<T>,
    updateLatestValue: (value: T) => any,
  ): Promise<T> {

    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<T>): void {}
}

const promiseStrategy = new PromiseStrategy();

class SyncStrategy<T = any> implements SubscriptionStrategy<T> {

  createSubscription(
    sync: T,
    updateLatestValue: (value: T) => any
  ): T {
    updateLatestValue(sync);

    return sync;
  }

  dispose(subscription: T): void {}
}

const syncStrategy = new SyncStrategy();


export function selectStrategy<T>(obj: Observable<T> | Promise<T> | EventEmitter<T> | T): SubscriptionStrategy<T> {
  if (isPromise(obj)) {
    return promiseStrategy;
  }

  if (isObservable(obj)) {
    return observableStrategy;
  }

  return syncStrategy;
}