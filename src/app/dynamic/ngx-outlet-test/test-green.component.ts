import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

import { NgxdDynamicModule } from './dynamic/dynamic.module';

@Component({
  selector: 'app-test-green',
  template: `
  <span>green {{ lable }}</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <dynamic [configs]="children"></dynamic>
  `,
  styles: [`
    :host {
      background-color: lightgreen;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestGreenComponent {
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
        name: 'test-green',
        component: TestGreenComponent,
      }]
    }),
  ],
  declarations: [
    TestGreenComponent
  ],
  exports: [
    TestGreenComponent,
  ],
})
export class TestGreenModule { }
