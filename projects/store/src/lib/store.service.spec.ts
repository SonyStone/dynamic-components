import { interval, Observable, of, Subject, Subscriber } from 'rxjs';
import { map, mapTo, publishReplay, tap } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';

class Store<T> {
  readonly actions$ = new Subject<Observable<T>>();

  readonly state$ = this.actions$.asObservable;
};

const asd = new Observable((observer: Subscriber<any>) => {

})

const zxc = map((x: number) => x * x)(of(1, 2, 3))

const testSchedulerFactory = () => new TestScheduler((actual, expected) => {
  expect(actual).toEqual(expected);
});

describe('Store Service', () => {
  it('hot observable example', () => {
    const testScheduler = testSchedulerFactory();

    testScheduler.run(({ hot, expectObservable  }) => {

      const source = hot('--a--a--a--a--a--a--a--a--a--');
      const sub1 = '      --^-----------!';
      const sub2 = '      ---------^--------!';
      const expect1 = '   --a--a--a--a--';
      const expect2 = '   -----------a--a--a-';
      expectObservable(source, sub1).toBe(expect1);
      expectObservable(source, sub2).toBe(expect2);
    });
  })

  it('interval', () => {
    const testScheduler = testSchedulerFactory();

    testScheduler.run(({ expectObservable  }) => {


      const source = interval(3, testScheduler).pipe(
        mapTo('a'),
        tap(
          (n) => { console.log(`log-next`, n); },
          (e) => { console.log(`log-error`, e); },
          () => { console.log(`log-complete`); },
        ),
        // publishReplay(),
      );

      const sub = '12ms !';
      const expect = '3ms a 2ms a 2ms a';

      expectObservable(source, sub).toBe(expect);
    });
  })
})