import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { EcsCanvasComponent } from './ecs-canvas.component';

const routes: Routes = [
  { path: '', component: EcsCanvasComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [],
  declarations: [
    EcsCanvasComponent,
  ],
  providers: [],
})
export class EcsCanvasModule { }
