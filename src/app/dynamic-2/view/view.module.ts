import { NgModule } from '@angular/core';

import { DocViewerModule } from './doc-viewer/doc-viewer.module';
import { ViewComponent } from './view.component';

@NgModule({
  imports: [
    DocViewerModule,
  ],
  declarations: [
    ViewComponent,
  ],
  exports: [
    ViewComponent,
  ],
})
export class ViewModule { }
