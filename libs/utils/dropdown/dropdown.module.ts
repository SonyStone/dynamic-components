import { NgModule } from '@angular/core';

import { DropdownComponent } from './dropdown.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    [
      CommonModule,
    ],
  ],
  declarations: [
    DropdownComponent,
  ],
  exports: [
    DropdownComponent,
  ],
})
export class DropdownModule { }
