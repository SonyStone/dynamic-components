import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResearchModule } from './research.module';
import { StoreResearchComponent } from './store-research.component';

const routes: Routes = [
  { path: '', component: StoreResearchComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ResearchModule,
  ],
})
export class ResearchRouteModule { }
