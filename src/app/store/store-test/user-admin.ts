import { Injectable, OnDestroy, Provider } from '@angular/core';
import { mapTo } from 'rxjs/operators';
import { AbstractContext, StoreService } from 'store';

@Injectable()
export class UserAdminStore extends StoreService<string> {
  constructor() { super(); }
}

@Injectable()
export class UserAdminContext extends AbstractContext<string> implements OnDestroy {

  $implicit = 'user admin';

  user = this.$implicit;

  private subscription = this.store.state$.subscribe((store) => {
    this.update(store);
  })

  rename = (user: string) => this.store.action(mapTo(user));

  reset = () => this.store.action(mapTo('name'));

  constructor(
    private store: UserAdminStore,
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

export const userAdminProviders: Provider[] = [
  UserAdminStore,
  UserAdminContext,
  {
    provide: 'user-admin',
    useExisting: UserAdminContext,
  },
]