import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicModule } from '@factory/utils';

import { TestBlueModule } from '../outlet-test/test-blue.component';
import { TestGreenModule } from '../outlet-test/test-green.component';
import { TestOrangeModule } from '../outlet-test/test-orange.component';
import { NgxOutletTestComponent } from './ngx-outlet-test.component';


const routes: Routes = [
  { path: '', component: NgxOutletTestComponent },
];

@NgModule({
  imports: [
    [
      CommonModule,
      RouterModule.forChild(routes),
    ],
    DynamicModule.forRoot(),
    TestOrangeModule,
    TestGreenModule,
    TestBlueModule,
  ],
  providers: [],
  declarations: [
    NgxOutletTestComponent,
  ],
})
export class OutletTestModule { }
