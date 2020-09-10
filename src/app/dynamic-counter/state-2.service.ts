import { Injectable } from '@angular/core';
import { Json, StoreSubject } from 'research';
import { pipe } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';

export class State2State {
  $implicit = this;
  name = '';
  time = 0;

  constructor(
    private store: StoreSubject<State2State>,
  ) {}

  next() {
    this.store.action(pipe(
      delay(1000),
      map((state: State2State) => {
        state.time += 1;

        return state;
      }),
      take(10),
    ));
  }
}

@Injectable({ providedIn: 'root' })
@Json('name', 'time')
export class State2Store extends StoreSubject<State2State> {

  constructor() {
    super();
  }

}
