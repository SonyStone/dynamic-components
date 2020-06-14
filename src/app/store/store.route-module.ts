import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'store-test',
    loadChildren: () => import('./store-test/store-test.route-module')
      .then((m) => m.StoreTestRouteModule),
  },
  {
    path: 'store-test-2',
    loadChildren: () => import('./store-test-2/store-test-2.route-module')
      .then((m) => m.StoreTest2RouteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class StoreRouteModule {}
