import { Injectable, Provider } from '@angular/core';
import { AbstractContext } from 'store';

const userTypes = [
  'user',
  'user-admin',
  'none',
]

@Injectable()
export class UserTypeContext extends AbstractContext<string> {

  type = 0;

  $implicit = userTypes[this.type];

  userType = this.$implicit;

  next = () => {
    this.type++;
    this.type = (this.type !== userTypes.length) ? this.type : 0;
    this.update(userTypes[this.type]);
  };

  constructor() {
    super();
  }

  update(user: string): this {
    this.$implicit = this.userType = user;

    return super._update();
  }
}

export const userTypeProviders: Provider[] = [
  {
    provide: 'user-type',
    useFactory: () => new UserTypeContext(),
  },
]