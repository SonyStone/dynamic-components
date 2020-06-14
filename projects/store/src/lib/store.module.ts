import { NgModule } from '@angular/core';

import { GetDataDirective } from './get-data.directive';
import { GetDataPipe } from './get-data.pipe';

@NgModule({
  declarations: [
    GetDataDirective,
    GetDataPipe,
  ],
  exports: [
    GetDataDirective,
    GetDataPipe,
  ],
})
export class StoreModule {}
