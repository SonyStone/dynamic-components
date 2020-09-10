import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BeforeDestroyModule, InsertVideoModule } from 'research';
import { StoreModule } from 'store';

import { DataObservableDirective } from './data-observable.directive';
import { DynamicCounterComponent } from './dynamic-counter.component';
import { DynamicCounterDirective } from './dynamic-counter.directive';
import { StoreObservableDirective } from './store-observable.directive';


@NgModule({
  imports: [
    [
      CommonModule,
      StoreModule,
      FormsModule,
    ],
    [
      InsertVideoModule,
      BeforeDestroyModule,
    ],
  ],
  providers: [],
  declarations: [
    DynamicCounterComponent,
    [
      DataObservableDirective,
      StoreObservableDirective,
      DynamicCounterDirective,
    ],
  ],
})
export class ResearchModule { }
