import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicModule, resolveDynamicModule } from 'dynamic';

import { DynamicTestComponent } from './dynamic-test.component';

const routes: Routes = [
  { path: '', component: DynamicTestComponent },
];

@NgModule({
  imports: [
    [
      RouterModule.forChild(routes),
      CommonModule,
    ],
    [
      DynamicModule.with({
        types: [
          {
            types: ['hero-card'],
            loadModule: () => import('./components/hero-card').then((m) =>
              resolveDynamicModule(m.HeroCardModule)
                .withComponent(m.HeroCardComponent, 'hero-card')
            ),
          },
          {
            types: ['hero-name-common', 'hero-name-epic'],
            loadModule: () => import('./components/hero-name').then((m) =>
              resolveDynamicModule(m.HeroNameModule)
                .withTemplates(m.HeroNameComponent, ['hero-name-common', 'hero-name-epic'])
            ),
          },
        ],
      })
    ],
  ],
  providers: [],
  declarations: [
    DynamicTestComponent,
  ],
})
export class DynamicTestModule {}
