import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BeforeDestroyModule, InsertVideoModule } from 'research';
import { StoreModule } from 'store';

import { DataObservableDirective } from './data-observable.directive';
import { DynamicCounterDirective } from './dynamic-counter.directive';
import { StoreObservableDirective } from './store-observable.directive';
import { StoreResearchComponent } from './store-research.component';
import { StoreSubjectDirective } from './store-subject.directive';

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
    StoreResearchComponent,
    [
      DataObservableDirective,
      StoreObservableDirective,
      StoreSubjectDirective,
      DynamicCounterDirective,
    ],
  ],
})
export class ResearchModule { }
