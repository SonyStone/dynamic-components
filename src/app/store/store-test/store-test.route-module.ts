import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StoreTestComponent } from './store-test.component';
import { StoreTestModule } from './store-test.module';

const routes: Routes = [
  { path: '', component: StoreTestComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreTestModule,
  ],
})
export class StoreTestRouteModule { }
