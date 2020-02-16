import { NgModule } from '@angular/core';

import { DoCheckOnlyComponent, OnInitAndDoCheckComponent, OnInitOnlyComponent } from './adapter/lifecycle.components';
import { NgxComponentOutletDirective, NgxComponentOutletInjectorDirective } from './directive/component.outlet';
import { NgxComponentOutletResolvePipe } from './helpers/resolve.pipe';

@NgModule({
  declarations: [
    [
      NgxComponentOutletDirective,
      NgxComponentOutletInjectorDirective,
    ],
    NgxComponentOutletResolvePipe,
    OnInitOnlyComponent,
    DoCheckOnlyComponent,
    OnInitAndDoCheckComponent,
  ],
  exports: [
    [
      NgxComponentOutletDirective,
      NgxComponentOutletInjectorDirective,
    ],
    NgxComponentOutletResolvePipe,
  ],
})
export class NgxdModule {}
