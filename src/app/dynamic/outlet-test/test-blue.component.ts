import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { DynamicModule } from '@factory/utils';

@Component({
  selector: 'app-test-1',
  template: `
  <span>blue</span>
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
}


@NgModule({
  imports: [
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
