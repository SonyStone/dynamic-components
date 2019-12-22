import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxdModule } from '@ngxd/core';

import { ComponentOutletComponent } from './component-outlet.component';

@NgModule({
  imports: [
    [
      CommonModule,
    ],
    [
      NgxdModule,
    ],
  ],
  declarations: [
    ComponentOutletComponent,
  ],
  exports: [
    ComponentOutletComponent,
  ],
})
export class ComponentOutletModule { }
