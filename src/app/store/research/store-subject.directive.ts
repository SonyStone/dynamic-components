import { Directive, Inject, OnDestroy } from '@angular/core';
import { CONSOLE } from 'doc-viewer';
import { pipe } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { ViewContextHandler } from 'store';

import { State1Service } from './state-1.service';
import { State2Store } from './state-2.service';

@Directive({
  selector: '[appStoreSubject]',
  providers: [
    ViewContextHandler,
  ],
})
export class StoreSubjectDirective implements OnDestroy {

  private subscription = this.store
    .pipe(
      // tap((v) => this.console.log(`log-name`, v)),
    )
    .subscribe((context) => {
      this.viewContextHandler.update(context);
    });

  constructor(
    @Inject(CONSOLE) private console: Console,
    private store: State2Store,
    private viewContextHandler: ViewContextHandler<State1Service>,
  ) {
    // this.store.action(
    //   switchMap((data) => merge(
    //     of(undefined).pipe(
    //       map(() => {
    //         data.name = 'first log';
    //         return data;
    //       }),
    //     ),
    //     of(undefined).pipe(
    //       map(() => {
    //         data.name = 'second log';
    //         return data;
    //       }),
    //       delay(1000),
    //     ),
    //   ))
    // )

    this.store.action(
      pipe(
        map((data) => {
          data.name = 'inbetween log';
          return data;
        }),
        delay(500),
      )
    )

    // this.store.action(
    //   switchMap((data) => timer(200, 1000).pipe(
    //     map((time) => {

    //       data.name = 'timer 1 log';
    //       data.time = time;

    //       return data;
    //     }),
    //     take(10),
    //   ))
    // )

    // this.store.action(
    //   switchMap((data) => timer(1200, 500).pipe(
    //     map((time) => {

    //       data.name = 'timer 2 log';
    //       data.time = time;

    //       return data;
    //     }),
    //     take(10),
    //   ))
    // )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.viewContextHandler.ngOnDestroy();
  }
}