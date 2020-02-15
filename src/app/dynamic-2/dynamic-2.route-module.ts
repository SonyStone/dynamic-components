import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'view',
    loadChildren: () => import('./view/view.route-module')
      .then((m) => m.ViewRouteModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class Dynamic2RouteModule {}
