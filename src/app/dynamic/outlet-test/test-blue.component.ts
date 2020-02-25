import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { DynamicModule } from '@factory/utils';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-blue',
  template: `
  <span>blue {{ lable }}</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <div class="table">
  <div class="left">
    <ng-container dynamic-children-outlet="left"></ng-container>
  </div>
  <div class="right">
    <ng-container dynamic-children-outlet="right"></ng-container>
  </div>
  </div>
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
    .table {
      display: flex;
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
    DynamicModule.forChild({
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
