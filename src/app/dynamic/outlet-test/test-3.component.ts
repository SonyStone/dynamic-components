import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { DynamicModule } from '@factory/utils';

@Component({
  selector: 'app-test-1',
  template: `
  Link
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
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
export class Test3Component {
  number = (Math.random() * 100).toFixed();
}


@NgModule({
  imports: [
    DynamicModule.forChild({
      types: [{
        name: 'test-3',
        component: Test3Component,
      }]
    }),
  ],
  declarations: [
    Test3Component
  ],
  entryComponents: [
    Test3Component,
  ],
  exports: [
    Test3Component,
  ],
})
export class Test3Module { }
