import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxdModule } from '@ngxd/core';
import { StoreModule } from 'store';

import { DynamicTestComponent } from './dynamic-test.component';
import { DynamicModule } from './dynamic.directive';

const routes: Routes = [
  { path: '', component: DynamicTestComponent },
];

@NgModule({
  imports: [
    [
      RouterModule.forChild(routes),
      CommonModule,
    ],
    [
      StoreModule,
      NgxdModule,
    ],
    [
      DynamicModule,
    ],
  ],
  providers: [],
  declarations: [
    DynamicTestComponent,
  ],
})
export class DynamicTestModule {}
