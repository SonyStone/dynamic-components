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
export class Test2Component {
  number = (Math.random() * 100).toFixed();
}


@NgModule({
  imports: [
    DynamicModule.forChild({
      types: [{
        name: 'test-2',
        component: Test2Component,
      }]
    }),
  ],
  declarations: [
    Test2Component
  ],
  entryComponents: [
    Test2Component,
  ],
  exports: [
    Test2Component,
  ],
})
export class Test2Module { }
