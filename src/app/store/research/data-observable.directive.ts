import { Directive, OnDestroy } from '@angular/core';
import { DataObservable, UserService } from 'research';
import { ViewContextHandler } from 'store';

@Directive({
  selector: '[appDataObservable]',
  providers: [
    ViewContextHandler,
  ],
})
export class DataObservableDirective implements OnDestroy {

  private subscription = this.dataObservable.subscribe((context) => {
    this.viewContextHandler.update(context);
  })

  constructor(
    private dataObservable: DataObservable,
    private viewContextHandler: ViewContextHandler<UserService>,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.viewContextHandler.ngOnDestroy();
  }
}