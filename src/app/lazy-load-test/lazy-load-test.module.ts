import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LazyLoadTestComponent } from './lazy-load-test.component';
import { LeaveGuard } from './leave-duard';
import { Test2Module } from './test-2.module';

const routes: Routes = [
  {
    path: '',
    component: LazyLoadTestComponent,
    canDeactivate: [LeaveGuard],
    children: [
      {
        path: 'route-1',
        loadChildren: () => import('./route-1/route-1').then((mod) => mod.Route1Module),
      },
      {
        path: 'route-2',
        loadChildren: () => import('./route-2/route-2').then((mod) => mod.Route2Module),
      },
    ],
  },

];

@NgModule({
  imports: [
    [
      CommonModule,
      RouterModule.forChild(routes),
    ],
    [
      Test2Module,
    ],
  ],
  providers: [
    LeaveGuard,
  ],
  declarations: [
    LazyLoadTestComponent,
  ],
})
export class LazyLoadTestModule {}
