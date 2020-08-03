import { NgModule } from '@angular/core';

import { PortalContentModule } from '../lib/portal-content.module';
import { Test3Component } from './test-3.component';
import { Test4Component } from './test-4.component';

@NgModule({
  imports: [
    PortalContentModule.forChild({
      types: [
        {
          names: ['test-3-template', 'test-4-template'],
          component: Test4Component,
        }, {
          name: 'test-3-component',
          component: Test3Component,
        },
      ]
    }),
  ],
  declarations: [
    Test4Component,
    Test3Component,
  ],
  exports: [
    Test4Component,
    Test3Component,
  ],
})
export class Test2Module {}
