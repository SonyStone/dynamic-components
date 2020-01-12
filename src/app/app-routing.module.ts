import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'dynamic',
    loadChildren: () => import('./dynamic/dynamic.module').then((mod) => mod.DynamicModule),
  },
  {
    path: 'ecs',
    loadChildren: () => import('./ecs/ecs.module').then((mod) => mod.EcsModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
