import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DynamicCounterComponent } from './dynamic-counter.component';
import { ResearchModule } from './dynamic-counter.module';

const routes: Routes = [
  { path: '', component: DynamicCounterComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ResearchModule,
  ],
})
export class DynamicCounterRouteModule { }
