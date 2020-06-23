import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, Type } from '@angular/core';
import { WithComponent } from 'dynamic';


@Component({
  selector: 'app-test-3',
  template: `
  Test 3
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  `,
  styles: [`
    :host {
      background-color: gray;
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

  @Input() children: any;
}

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Test3Component
  ],
  exports: [
    Test3Component,
  ],
})
export class Test3Module implements WithComponent {
  component: Type<any> = Test3Component;
}
