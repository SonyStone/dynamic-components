import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { DynamicModule } from '@factory/utils';

@Component({
  selector: 'app-test-green',
  template: `
  <span>green</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <!-- <dynamic [configs]="children"></dynamic> -->
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

  // @Input() children: any;
}


@NgModule({
  imports: [
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
