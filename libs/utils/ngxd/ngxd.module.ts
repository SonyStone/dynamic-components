import { NgModule } from '@angular/core';

import { DoCheckOnlyComponent, OnInitAndDoCheckComponent, OnInitOnlyComponent } from './adapter/lifecycle.components';

@NgModule({
  declarations: [
    OnInitOnlyComponent,
    DoCheckOnlyComponent,
    OnInitAndDoCheckComponent,
  ],
})
export class NgxdModule {}
