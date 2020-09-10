import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewComponent } from './view.component';
import { View2Module } from './view.module';

const routes: Routes = [
  {
    path: '',
    component: ViewComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    [
      View2Module,
    ],
  ],
})
export class View2RouteModule {}
