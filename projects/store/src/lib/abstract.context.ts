import { Observable } from 'rxjs';

export interface AbstractContext<T>  {
  context$: Observable<T> | Promise<T> | T;
}

export interface Updatetable<C> {
  update(conetxt: C): void;
}
