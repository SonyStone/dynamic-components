import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'view',
    loadChildren: () => import('./dynamic-template/view.route-module')
      .then((m) => m.ViewRouteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class Dynamic4RoutingModule {}
