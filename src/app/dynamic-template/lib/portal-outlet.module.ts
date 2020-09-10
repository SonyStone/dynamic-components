import { NgModule } from '@angular/core';

import { PortalOutletDirective } from './portal-outlet.directive';

@NgModule({
  declarations: [
    PortalOutletDirective,
  ],
  exports: [
    PortalOutletDirective,
  ],
})
export class PortalOutletModule { }
