import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'ecs-canvas',
    loadChildren: () => import('./ecs-canvas/ecs-canvas.module').then((mod) => mod.EcsCanvasModule),
  },
];

export const EcsRoutingModule = RouterModule.forChild(routes);
