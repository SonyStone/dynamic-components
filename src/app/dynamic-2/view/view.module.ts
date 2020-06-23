import { NgModule } from '@angular/core';
import { CONSOLE, DocViewerModule, TARGET_ELEMENT_PARSER } from 'doc-viewer';
import { WebComponentModule } from 'dynamic';

import { RobotsService } from './doc-viewer/robots.service';
import { MetaTagsService, TitleService } from './doc-viewer/title.service';
import { InstructionStyleModule } from './instruction-style.component';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [
    DocViewerModule,
    WebComponentModule.forChild([
      {
        selector: 'app-test-1',
        load: () => import('./custom-elements/test-1/test-1.component').then((m) => m.Test1Module),
      },
      {
        selector: 'app-test-2',
        load: () => import('./custom-elements/test-2/test-2.component').then((m) => m.Test2Module),
      },
      {
        selector: 'app-test-3',
        load: () => import('../view-2/custom-elements/test-3/test-3.component').then((m) => m.Test3Module),
      },
      {
        selector: 'app-test-4',
        load: () => import('../view-2/custom-elements/test-4/test-4.component').then((m) => m.Test4Module),
      }
    ]),
    InstructionStyleModule,
  ],
  declarations: [
    ViewComponent,
  ],
  providers: [
    TitleService,
    MetaTagsService,
    { provide: TARGET_ELEMENT_PARSER, useExisting: TitleService, multi: true, },
    { provide: TARGET_ELEMENT_PARSER, useExisting: MetaTagsService, multi: true, },
    // { provide: TARGET_ELEMENT_PARSER, useClass: TableOfContent, multi: true, },
    { provide: TARGET_ELEMENT_PARSER, useClass: RobotsService, multi: true },
    { provide: CONSOLE, useValue: console, },
  ],
  exports: [
    ViewComponent,
  ],
})
export class ViewModule {}
