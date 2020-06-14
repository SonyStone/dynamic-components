import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxdModule } from '@ngxd/core';
import { StoreModule } from 'store';

import { DynamicTestComponent } from './dynamic-test.component';
import { DynamicModule } from './dynamic.directive';
import { Test1Module } from './test-1';

const routes: Routes = [
  { path: '', component: DynamicTestComponent },
];

@NgModule({
  imports: [
    [
      RouterModule.forChild(routes),
      CommonModule,
      Test1Module,
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
export class DynamicTestModule { }
