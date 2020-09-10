import { ChangeDetectionStrategy, Component } from '@angular/core';

import { userProviders } from './user';
import { userAdminProviders } from './user-admin';

@Component({
  selector: 'app-store-test',
  templateUrl: 'store-test.component.html',
  styleUrls: ['store-test.component.scss'],
  providers: [
    userProviders,
    userAdminProviders,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTestComponent {}
