import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dynamic-test',
    loadChildren: () => import('./dynamic-test/dynamic-test.module')
      .then((m) => m.DynamicTestModule),
  },
  {
    path: 'outlet-test',
    loadChildren: () => import('./outlet-test/outlet-test.module')
      .then((m) => m.OutletTestModule),
  },
  {
    path: 'lazy-load-test',
    loadChildren: () => import('./lazy-load-test/lazy-load-test.module')
      .then((m) => m.LazyLoadTestModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class DynamicRouteModule {}
