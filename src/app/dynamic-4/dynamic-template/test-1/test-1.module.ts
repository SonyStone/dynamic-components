import { NgModule } from '@angular/core';

import { PortalContentModule } from '../lib/portal-content.module';
import { Test1Component } from './test-1.component';
import { Test2Component } from './test-2.component';

@NgModule({
  imports: [
    PortalContentModule.forChild({
      types: [
        {
          names: ['template-2', 'template-1'],
          component: Test1Component,
        }, {
          name: 'component-1',
          component: Test2Component,
        },
      ]
    }),
  ],
  declarations: [
    Test1Component,
    Test2Component,
  ],
  exports: [
    Test1Component,
    Test2Component,
  ],
})
export class Test1Module {}
