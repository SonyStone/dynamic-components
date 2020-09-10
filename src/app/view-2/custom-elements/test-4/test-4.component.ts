import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, Type } from '@angular/core';
import { WithComponent } from 'custom-element';

@Component({
  selector: 'app-test-4',
  template: `
  Test 4
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  `,
  styles: [`
    :host {
      background-color: gold;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test4Component {
  number = (Math.random() * 100).toFixed();

  @Input() children: any;
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Test4Component
  ],
  exports: [
    Test4Component,
  ],
  bootstrap: [
    Test4Component,
  ],
})
export class Test4Module implements WithComponent {
  component: Type<any> = Test4Component;
}
