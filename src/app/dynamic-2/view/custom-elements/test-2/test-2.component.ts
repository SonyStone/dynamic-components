import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnDestroy, Type } from '@angular/core';
import { WithComponent } from 'dynamic';


@Component({
  selector: 'app-test-2',
  template: `
  Test 2
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  `,
  styles: [`
    :host {
      background-color: green;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test2Component implements OnDestroy {
  number = (Math.random() * 100).toFixed();

  @Input() children: any;

  constructor() {
    console.log(`constructor :: Test2Component`);
  }

  ngOnDestroy(): void {
    console.log(`destroy :: Test2Component`);
  }
}


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    Test2Component
  ],
  exports: [
    Test2Component,
  ],
  bootstrap: [
    Test2Component,
  ],
})
export class Test2Module implements WithComponent {
  component: Type<any> = Test2Component;
}
