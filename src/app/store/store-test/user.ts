import { Injectable, OnDestroy, Provider } from '@angular/core';
import { of } from 'rxjs';
import { mapTo, shareReplay } from 'rxjs/operators';
import { AbstractContext, StoreService } from 'store';


@Injectable()
export class UserStore extends StoreService<string> {
  constructor() { super(); }
}

@Injectable()
export class UserContext extends AbstractContext<string> implements OnDestroy {

  $implicit = 'name';

  user = this.$implicit;

  private subscription = this.store.state$.subscribe((store) => {
    this.update(store);
  })

  rename = (user: string) => this.store.action(mapTo(user));

  reset = () => this.store.action(mapTo(`name ${Math.random()}`));

  constructor(
    private store: UserStore,
  ) {
    super();
  }

  update(user: string): this {
    this.$implicit = this.user = user;

    return super._update();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

export const userProviders: Provider[] = [
  UserStore,
  UserContext,
  {
    provide: 'user',
    useFactory: (context: UserContext) =>
      // of(context).pipe(shareReplay(1)),
      new Promise((resolve) => resolve(context)),
    deps: [
      UserContext,
    ],
  },
]