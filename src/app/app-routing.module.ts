import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


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
  {
    path: 'store',
    loadChildren: () => import('./store/store.route-module')
      .then((m) => m.StoreRouteModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
