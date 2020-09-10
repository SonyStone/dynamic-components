import { NgModule } from '@angular/core';

import { PortalOutletModule } from './lib/portal-outlet.module';
import { Test2Module } from './test-2/test-2.module';
import { ViewComponent } from './view.component';


@NgModule({
  imports: [
    Test2Module,
    PortalOutletModule,
    // PortalContentModule.forChild([
    //   {

    //   },
    //   {
    //     selector: 'app-test-4',
    //     load: () => import('./custom-elements/test-4/test-4.component').then((m) => m.Test4Module),
    //   }
    // ]),
  ],
  declarations: [
    ViewComponent,
  ],
  providers: [],
  exports: [
    ViewComponent,
  ],
})
export class ViewModule { }
