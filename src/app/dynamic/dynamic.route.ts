import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dynamic-test',
    loadChildren: () => import('./dynamic-test/dynamic-test.module').then((mod) => mod.DynamicTestModule),
  },
  {
    path: 'outlet-test',
    loadChildren: () => import('./outlet-test/outlet-test.module').then((mod) => mod.OutletTestModule),
  },
];

export const DynamicRoutingModule = RouterModule.forChild(routes);
