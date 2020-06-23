import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'view',
    loadChildren: () => import('./view/view-routing.module')
      .then((m) => m.ViewRoutingModule),
  },
  {
    path: 'view-2',
    loadChildren: () => import('./view-2/view.route-module')
      .then((m) => m.View2RouteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class Dynamic2RouteModule {}
