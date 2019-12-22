import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DynamicRoutingModule } from './dynamic.route';

@NgModule({
  imports: [
    CommonModule,
    DynamicRoutingModule,
  ],
})
export class DynamicModule {}
