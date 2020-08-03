import { Injectable } from '@angular/core';
import { Json, StoreSubject, Store } from 'research';
import { pipe } from 'rxjs';
import { delay, map, take } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class Effects {
  next = pipe(
    delay(1000),
    map((state: State2Service) => {
      state.time += 1;

      return state;
    }),
    take(10),
  )
}

@Injectable({ providedIn: 'root' })
@Json('name', 'time')
export class State2Service {
  $implicit = this;
  name = '';
  time = 0;
}

@Injectable({ providedIn: 'root' })
export class State2Store extends StoreSubject<State2Service> {

  $implicit = this.state;

  constructor(
    private effects: Effects,
    private state: State2Service,
  ) {
    super(state);
  }

  // next = () => {
  //   this.action(this.effects.next)
  // }
}
