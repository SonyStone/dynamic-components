import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { StoreTestComponent } from './store-test.component';
import { User1Module } from './user/user-1.component';
import { User2Module } from './user/user-2.component';
import { User3Module } from './user/user-3.component';

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
    [
      User1Module,
      User2Module,
      User3Module,
    ],
  ],
  providers: [],
  declarations: [
    StoreTestComponent,
  ],
})
export class StoreTestModule { }
