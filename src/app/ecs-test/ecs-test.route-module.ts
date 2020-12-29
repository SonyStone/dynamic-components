import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ECSTestComponent } from './ecs-test.component';
import { ECSTestModule } from './ecs-test.module';

const routes: Routes = [
  { path: '', component: ECSTestComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ECSTestModule,
  ],
})
export class ECSTestRouteModule { }
