import { NgModule } from '@angular/core';

import { userAdminProviders } from '../user-admin';

@NgModule({
  providers: [
    userAdminProviders,
  ],
})
export class TestData2Module {
  type = 'user-admin-2';
}
