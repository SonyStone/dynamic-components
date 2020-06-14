import { ConnectableObservable, MonoTypeOperatorFunction, OperatorFunction } from 'rxjs';

export type AnyOperatorFunction<T, B> =
  OperatorFunction<T | B, T | B>
  | MonoTypeOperatorFunction<T | B>;

export interface Store<T, B = T> {
  state$: ConnectableObservable<T | B>;
  action(action: AnyOperatorFunction<T, B>): void;
}
