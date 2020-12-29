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
  {
    path: 'ngxd-outlet-test',
    loadChildren: () => import('./ngx-outlet-test/ngx-outlet-test.module')
      .then((m) => m.NgxOutletTestModule),
  },
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
  {
    path: 'dynamic-test-2',
    loadChildren: () => import('./dynamic-test-2/dynamic-test.module')
      .then((m) => m.DynamicTestModule),
  },
  {
    path: 'dynamic-test-3',
    loadChildren: () => import('./dynamic-test-3/dynamic-test.module')
      .then((m) => m.DynamicTestModule),
  },
  {
    path: 'dynamic-template',
    loadChildren: () => import('./dynamic-template/view.route-module')
      .then((m) => m.ViewRouteModule),
  },
  {
    path: 'store-test',
    loadChildren: () => import('./store-test/store-test.route-module')
      .then((m) => m.StoreTestRouteModule),
  },
  /** реализация примера со счётиком и кастомным стором  */
  {
    path: 'dynamic-counter',
    loadChildren: () => import('./dynamic-counter/dynamic-counter.route-module')
      .then((m) => m.DynamicCounterRouteModule),
  },
  /** реализация примера с пагинатором и кастомным стором */
  {
    path: 'store-paginator',
    loadChildren: () => import('./store-paginator/store-paginator.route-module')
      .then((m) => m.StorePaginatorRouteModule),
  },
  {
    path: 'ecs-test',
    loadChildren: () => import('./ecs-test/ecs-test.route-module')
      .then((m) => m.ECSTestRouteModule),
  },
  {
    path: '**',
    loadChildren: () => import('./empty-route/empty-route.route-module')
      .then((m) => m.EmptyRouteRouteModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
