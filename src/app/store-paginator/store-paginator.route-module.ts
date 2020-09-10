import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StorePaginatorModule } from './store-paginator.module';
import { StorePaginatorComponent } from './store-paginator.component';

const routes: Routes = [
  { path: '', component: StorePaginatorComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StorePaginatorModule,
  ],
})
export class StorePaginatorRouteModule { }
