import { Injectable } from '@angular/core';
import { Json } from 'research';
import { MonoTypeOperatorFunction, pipe, timer } from 'rxjs';
import { groupBy, map, mergeMap, switchMap } from 'rxjs/operators';
import { StoreService } from 'store';

@Injectable({ providedIn: 'root' })
export class DynamicCounterEffects {

  start: MonoTypeOperatorFunction<DynamicCounter> =
    switchMap((counter) => timer(0, counter.tickSpeed)
      .pipe(
        map(() => {
          counter.count += counter.countDiff * counter.direction;

          return counter;
        }),
      )
    )

  count: MonoTypeOperatorFunction<DynamicCounter> =
    pipe(
      groupBy((counter) => counter.isTicking),
      mergeMap((group$) => group$.key
        ? group$.pipe(this.start)
        : group$
        )
    )
}

@Injectable({ providedIn: 'root' })
@Json('count', 'tickSpeed', 'countDiff')
export class DynamicCounter {
  $implicit = this;

  count = 0;
  tickSpeed = 200;
  countDiff = 1;

  direction = 1;
  isTicking = false;

  store = new StoreService<DynamicCounter>(this, switchMap);

  constructor(
    private effects: DynamicCounterEffects,
  ) {
    this.reset();
  }

  start = () => {
    this.store.action(pipe(
      map((counter) => {
        counter.isTicking = true;

        return this;
      }),
      this.effects.start
    ))
  };

  pause = () => {
    this.store.action(pipe(
      map((counter) => {
        counter.isTicking = false;

        return this;
      }),
    ));
  };

  setTo = (count: number) => {
    this.store.action(pipe(
      map((counter) => {
        counter.count = count;

        return this;
      }),
      this.effects.count,
    ))
  }

  reset = () => {
    this.store.action(
      map((counter) => {
        counter.count = 0;
        counter.isTicking = false;

        return this;
      }),
    )
  };

  countUp = () => {
    this.store.action(pipe(
      map((counter) => {
        counter.direction = 1;

        return this;
      }),
      this.effects.count,
    ))
  };

  countDown = () => {
    this.store.action(pipe(
      map((counter) => {
        counter.direction = -1;

        return this;
      }),
      this.effects.count,
    ))
  };

  setSpeed = (tickSpeed: number) => {
    this.store.action(pipe(
      map((counter) => {
        counter.tickSpeed = tickSpeed;

        return this;
      }),
      this.effects.count,
    ))
  };

  setDiff = (countDiff: number) => {
    this.store.action(pipe(
      map((counter) => {
        counter.countDiff = countDiff;

        return this;
      }),
      this.effects.count,
    ))
  };


}