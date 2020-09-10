import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoreModule } from 'store';

import { PaginatorComponent } from './paginator.component';

@NgModule({
  imports: [
    [
      CommonModule,
      ReactiveFormsModule,
    ],
    [
      MatFormFieldModule,
      MatSelectModule,
      MatTooltipModule,
    ],
    [
      StoreModule,
    ],
  ],
  exports: [PaginatorComponent],
  declarations: [PaginatorComponent],
  providers: [],
})
export class PaginatorModule { }
