import { NgModule } from '@angular/core';

import { BeforeDestroyModule } from './before-destroy.directive';
import { PreventPauseDirective } from './prevent-pause.directive';
import { VideoComponent } from './video.component';

@NgModule({
  imports: [
    BeforeDestroyModule,
  ],
  declarations: [
    VideoComponent,
    PreventPauseDirective,
  ],
  exports: [
    VideoComponent,
  ],
})
export class VideoModule { }
