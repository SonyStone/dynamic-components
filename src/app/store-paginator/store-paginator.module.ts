import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { StoreModule } from 'store';

import { PaginatorModule } from './paginator';
import { StorePaginatorComponent } from './store-paginator.component';

@NgModule({
  imports: [
    [
      CommonModule,
      StoreModule,
      FormsModule,
    ],
    [
      PaginatorModule,
    ],
  ],
  providers: [],
  declarations: [
    StorePaginatorComponent,
  ],
})
export class StorePaginatorModule { }
