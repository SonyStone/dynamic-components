import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, OnDestroy } from '@angular/core';
import { DynamicModule } from '@factory/utils';

@Component({
  selector: 'app-test-1',
  template: `
  Test 1
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
export class Test1Component implements OnDestroy {
  number = (Math.random() * 100).toFixed();

  @Input() children: any;

  constructor() {
    console.log(`constructor :: Test1Component`);
  }

  ngOnDestroy(): void {
    console.log(`destroy :: Test1Component`);
  }
}


@NgModule({
  imports: [
    CommonModule,
    DynamicModule.forChild({
      types: [{
        name: 'lazy-test-1',
        component: Test1Component,
      }]
    }),
  ],
  declarations: [
    Test1Component
  ],
  exports: [
    Test1Component,
  ],
  bootstrap: [
    Test1Component,
  ],
})
export class Test1Module { }
