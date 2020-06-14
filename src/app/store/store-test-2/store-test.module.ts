import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { StoreTestComponent } from './store-test.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
  ],
  providers: [],
  declarations: [
    StoreTestComponent,
  ],
})
export class StoreTestModule { }
