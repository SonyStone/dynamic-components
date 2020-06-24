import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { WithComponent } from 'custom-element';

import { TocComponent } from './toc.component';
import { TocDirective } from './toc.directive';

@NgModule({
  imports: [
    CommonModule,
    // MatIconModule,
  ],
  declarations: [
    TocComponent,
    TocDirective,
  ],
})
export class TocModule implements WithComponent {
  component: Type<any> = TocComponent;
}
