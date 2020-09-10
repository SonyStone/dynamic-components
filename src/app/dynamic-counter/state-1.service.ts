import { Injectable } from '@angular/core';
import { StoreSubject, Json } from 'research';
import { pipe } from 'rxjs';
import { delay, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
@Json('name', 'time')
export class State1Store extends StoreSubject<any> {
  $implicit = this;
  name = '';
  time = 0;

  constructor() {
    super();
  }

  next = () => {
    this.action(pipe(
      delay(1000),
      map(() => {
        this.time += 1;

        return this;
      })
    ));
  }
}
