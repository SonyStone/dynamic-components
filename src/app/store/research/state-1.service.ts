import { Injectable } from '@angular/core';
import { Json, StoreSubject } from 'research';
import { pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@Json('name', 'time')
export class State1Service {
  $implicit = this;
  name = '';
  time = 0;

  // constructor(
  //   private store: StateStore,
  // ) {}

  // next = () => {
  //   this.store.action(pipe(
  //     delay(1000),
  //     map(() => {
  //       this.time += 1;

  //       return this;
  //     })
  //   ))
  // }
}

@Injectable({ providedIn: 'root' })
export class State1Store extends StoreSubject<State1Service> {
  constructor(state: State1Service) { super(state); }
}