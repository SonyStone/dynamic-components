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
    path: 'dynamic-3',
    loadChildren: () => import('./dynamic-3/dynamic-3.route-module')
      .then((m) => m.Dynamic3RouteModule),
  },
  {
    path: 'dynamic-4',
    loadChildren: () => import('./dynamic-4/dynamic-routing.module')
      .then((m) => m.Dynamic4RoutingModule),
  },
  {
    path: 'store',
    loadChildren: () => import('./store/store.route-module')
      .then((m) => m.StoreRouteModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
