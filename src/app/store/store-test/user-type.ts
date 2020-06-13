import { Injectable, Provider } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { AbstractContext, Data } from 'store';

const userTypes = [
  'user',
  'user-admin',
  'none',
]

@Injectable()
@Data({ selector: 'user-type' })
export class UserTypeContext implements AbstractContext<UserTypeContext> {

  type = 1;

  $implicit = userTypes[this.type];

  userType = this.$implicit;

  context$ = new BehaviorSubject<this>(this);

  sub = timer(3000, 3000).subscribe(() => this.next());

  next = () => {
    this.type++;
    this.type = (this.type !== userTypes.length) ? this.type : 0;
    this.update(userTypes[this.type]);
    this.context$.next(this);
  };

  update(user: string): void {
    this.$implicit = this.userType = user;
  }
}

export const userTypeProviders: Provider[] = [
  UserTypeContext,
]