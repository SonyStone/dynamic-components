import { ChangeDetectionStrategy, Component, Input, NgModule, Type } from '@angular/core';

@Component({
  selector: 'app-test-3',
  template: `
  Link app-test-3
  <ng-content select="div"></ng-content>
  <input [value]="number">
  <pre>template1: {{ template1 }}</pre>
  <pre>template3: {{ template3 }}</pre>
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

  @Input() template1 = 'empty 1';
  @Input() template3 = 'empty 2';
}

@NgModule({
  exports: [Test3Component],
  declarations: [Test3Component],
})
export class Test3Module {
  component: Type<any> = Test3Component;
}
