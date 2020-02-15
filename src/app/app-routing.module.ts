import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'dynamic',
    loadChildren: () => import('./dynamic/dynamic.route-module')
      .then((m) => m.DynamicRouteModule),
  },
  {
    path: 'dynamic-2',
    loadChildren: () => import('./dynamic-2/dynamic-2.route-module')
      .then((m) => m.Dynamic2RouteModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
