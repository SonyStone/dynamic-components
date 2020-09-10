import { NgModule } from '@angular/core';
import { CustomElementModule } from 'custom-element';
import { CONSOLE, DocViewerModule } from 'doc-viewer';

import { ViewComponent } from './view.component';

@NgModule({
  imports: [
    DocViewerModule,
    CustomElementModule.forChild([
      {
        selector: 'app-test-3',
        load: () => import('./custom-elements/test-3/test-3.component').then((m) => m.Test3Module),
      },
      {
        selector: 'app-test-4',
        load: () => import('./custom-elements/test-4/test-4.component').then((m) => m.Test4Module),
      }
    ]),
  ],
  declarations: [
    ViewComponent,
  ],
  providers: [
    { provide: CONSOLE, useValue: console, },
  ],
  exports: [
    ViewComponent,
  ],
})
export class View2Module { }
