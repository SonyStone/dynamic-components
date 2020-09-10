import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

import { NgxdDynamicModule } from './dynamic/dynamic.module';

@Component({
  selector: 'app-test-1',
  template: `
  <span>blue {{ lable }}</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <dynamic [configs]="children"></dynamic>
  `,
  styles: [`
    :host {
      background-color: lightblue;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestBlueComponent {
  number = (Math.random() * 100).toFixed();

  @Input() children: any;
  @Input() lable: string;
}


@NgModule({
  imports: [
    [
      CommonModule,
    ],
    NgxdDynamicModule.forChild({
      types: [{
        name: 'test-blue',
        component: TestBlueComponent,
      }]
    }),
  ],
  declarations: [
    TestBlueComponent
  ],
  exports: [
    TestBlueComponent,
  ],
})
export class TestBlueModule { }
