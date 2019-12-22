import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponentContainerDirective } from './app-component-container.directive';
import { DynamicTestComponent } from './dynamic-test.component';
import { Test1Component } from './test-1.component';
import { Test2Component } from './test-2.component';
import { Test3Component } from './test-3.component';

const routes: Routes = [
  { path: '', component: DynamicTestComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  providers: [],
  declarations: [
    Test1Component,
    Test2Component,
    Test3Component,
    DynamicTestComponent,
    AppComponentContainerDirective,
  ],
  entryComponents: [
    Test1Component,
    Test2Component,
    Test3Component,
  ],
})
export class DynamicTestModule { }
