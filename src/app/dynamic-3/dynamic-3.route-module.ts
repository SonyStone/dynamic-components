import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'dynamic-test',
    loadChildren: () => import('./dynamic-test/dynamic-test.module')
      .then((m) => m.DynamicTestModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class Dynamic3RouteModule {}
