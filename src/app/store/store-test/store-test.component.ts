import { ChangeDetectionStrategy, Component, VERSION } from '@angular/core';
import { of, timer } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { userProviders } from './user';
import { userAdminProviders } from './user-admin';

@Component({
  selector: 'app-store-test',
  templateUrl: 'store-test.component.html',
  styleUrls: ['store-test.component.scss'],
  providers: [
    {
      provide: 'example 1',
      useFactory: () => of({
        $implicit: 'hello world ',
        version: VERSION,
      }),
    },
    {
      provide: 'example 2',
      useFactory: () => {
        const context = { $implicit: 0 }

        return timer(0, 1000).pipe(
          startWith(0),
          map((t) => {
            context.$implicit = t;

            return context;
          })
        )
      },
    },
    userProviders,
    userAdminProviders,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTestComponent {}
