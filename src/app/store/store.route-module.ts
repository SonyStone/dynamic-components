import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'store-test',
    loadChildren: () => import('./store-test/store-test.route-module')
      .then((m) => m.StoreTestRouteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class StoreRouteModule {}
