import { Injectable, Provider, OnDestroy } from '@angular/core';
import { pipe, timer } from 'rxjs';
import { delay, mapTo, tap } from 'rxjs/operators';
import { AbstractContext, Data, StoreService } from 'store';


@Injectable()
export class UserStore extends StoreService<string> {
  constructor() { super(); }
}

@Injectable()
export class UserContext implements OnDestroy {

  $implicit: string;
  user: string;

  buttons = { rename: 'rename', reset: 'reset' };

  private subscription = timer(1000, 1000).subscribe(() => this.reset());

  get = () => this.store.action(pipe(delay(1000), mapTo('name')))

  rename = (user: string) => this.store.action(mapTo(`${user} ${Math.random()}`));

  reset = () => this.store.action(mapTo(`name ${Math.random()}`));

  constructor(
    private store: UserStore,
  ) {
    this.get();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  update(user: string): void {
    this.$implicit = this.user = user;
  }
}

@Injectable()
@Data({ selector: 'user' })
export class UserData implements AbstractContext<UserContext> {

  context$ = this.store.state$
    .pipe(
      tap((store) => {
        this.context.update(store);
      }),
      mapTo(this.context)
    );

  constructor(
    private store: UserStore,
    protected context: UserContext,
  ) {}
}

export const userProviders: Provider[] = [
  UserStore,
  UserData,
  UserContext,
];
