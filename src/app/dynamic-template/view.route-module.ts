import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ViewComponent } from './view.component';
import { ViewModule } from './view.module';

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
      ViewModule,
    ],
  ],
})
export class ViewRouteModule {}
