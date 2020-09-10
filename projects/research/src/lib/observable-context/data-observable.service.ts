import { Injectable } from '@angular/core';
import { ConnectableObservable, Observable, Subject, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { Json } from '../json-decorators/json';

@Injectable({ providedIn: 'root' })
@Json('name', 'surname', 'time')
export class UserService {
  $implicit = this;
  name = 'Igor';
  surname = 'Pupkin';
  time = 0;
}

@Injectable({ providedIn: 'root' })
export class DataObservable extends Observable<UserService> {
  source = timer(1000, 1000).pipe(
    map((time) => {
      this.user.time = time;

      return this.user;
    }),
    startWith(this.user),
  );

  constructor(
    private user: UserService,
  ) {
    super();

  }
}

@Injectable({ providedIn: 'root' })
export class DataConnectableObservable extends ConnectableObservable<UserService> {

  constructor(
    private user: UserService,
  ) {
    super(
      timer(1000, 1000).pipe(
        map((time) => {
          this.user.time = time;

          return this.user;
        }),
      ),
      () => new Subject(),
    );

    this.connect();
  }
}