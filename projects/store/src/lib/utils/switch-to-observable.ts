import { from, isObservable, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { isPromise } from './is-promise';

export type AsyncLike<T> = Observable<T> | Promise<T> | T;

export const switchToObservable = <T>() => switchMap<AsyncLike<T>, Observable<T>>((obj) => {
  if (isObservable(obj)) {
    return obj;
  }

  if (isPromise(obj)) {
    return from(obj);
  }

  return of(obj);
})