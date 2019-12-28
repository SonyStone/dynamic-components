import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicModule } from '@factory/utils';

import { HelloComponent } from './hello.component';
import { OutletTestComponent } from './outlet-test.component';
import { Test1Module } from './test-1.component';
import { Test2Module } from './test-2.component';
import { Test3Module } from './test-3.component';

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
    Test1Module,
    Test2Module,
    Test3Module,
  ],
  providers: [],
  declarations: [
    HelloComponent,
    OutletTestComponent,
  ],
})
export class OutletTestModule { }
