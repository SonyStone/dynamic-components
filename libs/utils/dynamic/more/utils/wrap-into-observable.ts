import { isObservable, from, of, Observable } from 'rxjs';
import { isPromise } from '@angular/compiler/src/util';

export const wrapIntoObservable = <T>(value: T | Promise<T>| Observable<T>): Observable<T> => {
  if (isObservable(value)) {
    return value;
  }

  if (isPromise(value)) {
    // Use `Promise.resolve()` to wrap promise-like instances.
    // Required ie when a Resolver returns a AngularJS `$q` promise to correctly trigger the
    // change detection.
    return from(Promise.resolve(value));
  }

  return of(value);
};
