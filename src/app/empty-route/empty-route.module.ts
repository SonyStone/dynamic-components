import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { EmptyRouteComponent } from './empty-route.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
  ],
  providers: [],
  declarations: [
    EmptyRouteComponent,
  ],
})
export class EmptyRouteModule { }
