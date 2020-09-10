import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EmptyRouteComponent } from './empty-route.component';
import { EmptyRouteModule } from './empty-route.module';

const routes: Routes = [
  { path: '', component: EmptyRouteComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    EmptyRouteModule,
  ],
})
export class EmptyRouteRouteModule { }
