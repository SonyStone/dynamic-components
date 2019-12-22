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
      background-color: orange;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test1Component {
  number = (Math.random() * 100).toFixed();
}


@NgModule({
  imports: [
    DynamicModule.forChild({
      types: [{
        name: 'test-1',
        component: Test1Component,
      }]
    }),
  ],
  declarations: [
    Test1Component
  ],
  entryComponents: [
    Test1Component,
  ],
  exports: [
    Test1Component,
  ],
})
export class Test1Module { }
