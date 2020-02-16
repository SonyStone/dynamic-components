import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicModule } from '@factory/utils';

import { HelloComponent } from './hello.component';
import { OutletTestComponent } from './outlet-test.component';
import { TestBlueModule } from './test-blue.component';
import { TestGreenModule } from './test-green.component';
import { TestOrangeModule } from './test-orange.component';

const routes: Routes = [
  { path: '', component: OutletTestComponent },
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
    HelloComponent,
    OutletTestComponent,
  ],
})
export class OutletTestModule { }
