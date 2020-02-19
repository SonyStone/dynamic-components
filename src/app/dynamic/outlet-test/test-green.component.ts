import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { DynamicModule } from '@factory/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-green',
  template: `
  <span>green {{ lable }}</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <pre>children: {{ children | json }}</pre>
  <ng-container *dynamicOutlet="children"></ng-container>
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
    DynamicModule.forChild({
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
