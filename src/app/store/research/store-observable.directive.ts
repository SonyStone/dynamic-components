import { Directive, Inject, Injectable, OnDestroy } from '@angular/core';
import { CONSOLE } from 'doc-viewer';
import { Json, Store } from 'research';
import { merge, of } from 'rxjs';
import { delay, map, switchMap } from 'rxjs/operators';
import { ViewContextHandler } from 'store';
import { State1Service } from './state-1.service';



@Directive({
  selector: '[appStoreObservable]',
  providers: [
    ViewContextHandler,
  ],
})
export class StoreObservableDirective implements OnDestroy {

  store = new Store<State1Service>(this.state);

  private subscription = this.store.subscribe((context) => {
    this.viewContextHandler.update(context);
  });

  constructor(
    @Inject(CONSOLE) private console: Console,
    private state: State1Service,
    private viewContextHandler: ViewContextHandler<State1Service>,
  ) {
    this.store.action(
      switchMap((data) => merge(
        of(undefined).pipe(
          map(() => {
            data.name = 'first log';
            return data;
          }),
        ),
        of(undefined).pipe(
          map(() => {
            data.name = 'second log';
            return data;
          }),
          delay(1000),
        ),
      ))
    )

    // this.store.action(
    //   pipe(
    //     map((data) => {
    //       data.name = 'inbetween log';
    //       return data;
    //     }),
    //     delay(500),
    //   )
    // )

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