import {
  ChangeDetectorRef,
  EventEmitter,
  NgModule,
  OnDestroy,
  Pipe,
  PipeTransform,
  Type,
  WrappedValue,
  ɵisObservable as isObservable,
  ɵisPromise as isPromise,
  ɵstringify as stringify,
} from '@angular/core';
import { Observable, SubscriptionLike } from 'rxjs';

export function invalidPipeArgumentError(type: Type<any>, value: Object) {
  return Error(`InvalidPipeArgument: '${value}' for pipe '${stringify(type)}'`);
}

interface SubscriptionStrategy {
  createSubscription(
    async: Observable<any> | Promise<any>,
    updateLatestValue: any
  ): SubscriptionLike | Promise<any>;

  dispose(subscription: SubscriptionLike | Promise<any>): void;
}

class ObservableStrategy implements SubscriptionStrategy {
  createSubscription(
    async: Observable<any>,
    updateLatestValue: any
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

class PromiseStrategy implements SubscriptionStrategy {
  createSubscription(
    async: Promise<any>,
    updateLatestValue: (v: any) => any
  ): Promise<any> {
    return async.then(updateLatestValue, e => {
      throw e;
    });
  }

  dispose(subscription: Promise<any>): void {}
}

const promiseStrategy = new PromiseStrategy();
const observableStrategy = new ObservableStrategy();

/**
 * @ngModule PushPipeModule
 * @description
 *
 * Unwraps a value from an asynchronous primitive.
 *
 * The `push` pipe subscribes to an `Observable` or `Promise` and returns the latest value it has
 * emitted. When a new value is emitted, the `push` pipe will run change detection and it works
 * even when `zone` has been disabled. When the component gets destroyed,
 * the `push` pipe unsubscribes automatically to avoid potential memory leaks.
 *
 */
@Pipe({ name: 'push', pure: false })
export class PushPipe implements PipeTransform, OnDestroy {
  private latestValue: any = null;
  private latestReturnedValue: any = null;

  private subscription: SubscriptionLike | Promise<any> | null = null;
  private obj: Observable<any> | Promise<any> | EventEmitter<any> | null = null;
  private strategy: SubscriptionStrategy = null!;

  constructor(
    private ref: ChangeDetectorRef
  ) {}

  transform<T>(obj: null): null;
  transform<T>(obj: undefined): undefined;
  transform<T>(obj: Observable<T> | Promise<T> | null | undefined): T | null;
  transform(obj: Observable<any> | Promise<any> | null | undefined): any {

    if (this.obj === null) {
      if (obj != null) {
        this.subscribe(obj);
      }
      this.latestReturnedValue = this.latestValue;
      return this.latestValue;
    }

    if (obj !== this.obj) {
      this.dispose();
      return this.transform(obj as any);
    }

    if (this.latestValue === this.latestReturnedValue) {
      return this.latestReturnedValue;
    }

    this.latestReturnedValue = this.latestValue;
    return WrappedValue.wrap(this.latestValue);
  }

  ngOnDestroy() {
    if (this.subscription !== null) {
      this.dispose();
    }
  }

  private subscribe(obj: Observable<any> | Promise<any> | EventEmitter<any>): void {
    this.obj = obj;
    this.strategy = this.selectStrategy(obj);
    this.subscription = this.strategy.createSubscription(obj, (value: Object) =>
      this.updateLatestValue(obj, value)
    );
  }

  private dispose(): void {
    this.strategy.dispose(this.subscription);
    this.latestValue = null;
    this.latestReturnedValue = null;
    this.subscription = null;
    this.obj = null;
  }

  private selectStrategy(obj: Observable<any> | Promise<any> | EventEmitter<any>): any {
    if (isPromise(obj)) {
      return promiseStrategy;
    }

    if (isObservable(obj)) {
      return observableStrategy;
    }

    throw invalidPipeArgumentError(PushPipe, obj);
  }

  private updateLatestValue(async: any, value: Object): void {
    if (async === this.obj) {
      this.latestValue = value;
      this.ref.detectChanges();
    }
  }
}

@NgModule({
  exports: [PushPipe],
  declarations: [PushPipe]
})
export class PushPipeModule {}
