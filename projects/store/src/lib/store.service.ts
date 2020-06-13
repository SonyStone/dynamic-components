import { OnDestroy } from '@angular/core';
import { ConnectableObservable, ObservableInput, of, OperatorFunction, Subject, Unsubscribable } from 'rxjs';
import { exhaustMap, publishReplay, tap } from 'rxjs/operators';

import { AnyOperatorFunction, Store } from './store.interface';

type TransformingOperator<T, B> =
  (project: (value: AnyOperatorFunction<T, B>, index: number) => ObservableInput<any>) => OperatorFunction<any, any>;

export class StoreService<T, B = T> implements Store<T, B>, Unsubscribable, OnDestroy {

  protected readonly actions$ = new Subject<AnyOperatorFunction<T, B>>();

  readonly state$: ConnectableObservable<T | B> =
    this.actions$.pipe(
      this.transformingOperator((action) => of(this.state).pipe(action)),
      tap((state) => this.state = state),
      publishReplay(1),
    ) as ConnectableObservable<T | B>;

  private readonly subscription = this.state$.connect();

  constructor(
    protected state?: T | B,
    protected transformingOperator: TransformingOperator<T, B> = exhaustMap,
  ) {}

  ngOnDestroy(): void {
    this.unsubscribe();
  }

  action(action: AnyOperatorFunction<T, B>): void {
    this.actions$.next(action);
  }

  unsubscribe(): void {
    this.subscription.unsubscribe();
  }
}
