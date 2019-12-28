import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LazyLoadTestComponent } from './lazy-load-test.component';

const routes: Routes = [
  { path: '', component: LazyLoadTestComponent },
];

@NgModule({
  imports: [
    [
      CommonModule,
      RouterModule.forChild(routes),
    ],
  ],
  providers: [],
  declarations: [
    LazyLoadTestComponent,
  ],
})
export class LazyLoadTestModule { }
