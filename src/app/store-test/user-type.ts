import { Injectable, Provider } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { AbstractContext, Data } from 'store';

import { UserData } from './user';
import { UserAdminContext } from './user-admin';

@Injectable()
export class UserTypesService extends Array {
  constructor(
    userData: UserData,
    userAdminContext: UserAdminContext,
  ) {
    super();
    this.push(userData);
    this.push(userAdminContext);
    this.push(undefined);
  }
}

@Injectable()
@Data({ selector: 'user-type' })
export class UserTypeContext implements AbstractContext<UserTypeContext> {

  type = 1;

  $implicit = this.userTypes[this.type];

  userType = this.$implicit;

  context$ = new BehaviorSubject<this>(this);

  sub = timer(3000, 3000).subscribe(() => this.next());

  next = () => {
    this.type++;
    this.type = (this.type !== this.userTypes.length) ? this.type : 0;
    this.update(this.userTypes[this.type]);
    this.context$.next(this);
  }

  update(user: any): void {
    this.$implicit = this.userType = user;
  }

  constructor(
    private userTypes: UserTypesService,
  ) {}
}

export const userTypeProviders: Provider[] = [
  UserTypesService,
  UserTypeContext,
];
