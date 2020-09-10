import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgxdDynamicModule } from './dynamic/dynamic.module';
import { NgxOutletTestComponent } from './ngx-outlet-test.component';
import { TestBlueModule } from './test-blue.component';
import { TestGreenModule } from './test-green.component';
import { TestOrangeModule } from './test-orange.component';


const routes: Routes = [
  { path: '', component: NgxOutletTestComponent },
];

@NgModule({
  imports: [
    [
      CommonModule,
      RouterModule.forChild(routes),
    ],
    NgxdDynamicModule.forRoot(),
    TestOrangeModule,
    TestGreenModule,
    TestBlueModule,
  ],
  providers: [],
  declarations: [
    NgxOutletTestComponent,
  ],
})
export class NgxOutletTestModule { }
