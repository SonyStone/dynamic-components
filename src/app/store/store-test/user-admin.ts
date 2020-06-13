import { Injectable, Provider } from '@angular/core';
import { mapTo, tap, shareReplay, startWith, delay } from 'rxjs/operators';
import { AbstractContext, Data, StoreService } from 'store';
import { pipe } from 'rxjs';

@Injectable()
export class UserAdminStore extends StoreService<string> {
  constructor() { super(); }
}

@Injectable()
@Data({ selector: 'user-admin' })
export class UserAdminContext implements AbstractContext<UserAdminContext> {

  $implicit: string;
  user: string;

  buttons = { rename: 'rename admin', reset: 'reset admin' };

  context$ = this.store.state$
    .pipe(
      tap((store) => this.update(store)),
      mapTo(this),
      startWith(this),
      shareReplay(1),
    )

  get = () => this.store.action(pipe(delay(1000), mapTo('user admin')))

  rename = (user: string) => this.store.action(mapTo(user));

  reset = () => this.store.action(mapTo('name'));

  constructor(
    private store: UserAdminStore,
  ) {
    this.get();
  }

  update(user: string): void {
    this.$implicit = this.user = user;
  }
}

export const userAdminProviders: Provider[] = [
  UserAdminStore,
  UserAdminContext,
];
