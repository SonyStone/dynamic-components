import { ChangeDetectionStrategy, Component, NgModule, Type, Input } from '@angular/core';

@Component({
  selector: 'app-test-2',
  template: `
  Link app-test-2
  <ng-content select="div"></ng-content>
  <input [value]="number">
  <pre>template3: {{ template3 }}</pre>
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

  @Input() template3 = 'empty 2';
}

@NgModule({
  exports: [Test2Component],
  declarations: [Test2Component],
})
export class Test2Module {
  component: Type<any> = Test2Component;
}
