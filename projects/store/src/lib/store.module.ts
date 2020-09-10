import { NgModule } from '@angular/core';

import { GetDataDirective } from './get-data.directive';
import { GetDataPipe } from './get-data.pipe';
import { StoreDirective } from './store.directive';

@NgModule({
  declarations: [
    GetDataDirective,
    GetDataPipe,
    StoreDirective,
  ],
  exports: [
    GetDataDirective,
    GetDataPipe,
    StoreDirective,
  ],
})
export class StoreModule {}
