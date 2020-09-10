import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';

import { NgxdDynamicModule } from './dynamic/dynamic.module';

@Component({
  selector: 'app-test-orange',
  template: `
  <span>orange {{ lable }}</span>
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <div class="flex">
    <div *ngFor="let child of children" class="flex-child">
      <dynamic [configs]="child"></dynamic>
    </div>
  <div>
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
    .flex {
      display: flex;
    }
    .flex-child {
      flex: 1 0 auto;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestOrangeComponent {
  number = (Math.random() * 100).toFixed();

  @Input() children: any;
  @Input() lable: string;
}


@NgModule({
  imports: [
    [
      CommonModule,
    ],
    NgxdDynamicModule.forChild({
      types: [{
        name: 'test-orange',
        component: TestOrangeComponent,
      }]
    }),
  ],
  declarations: [
    TestOrangeComponent
  ],
  exports: [
    TestOrangeComponent,
  ],
})
export class TestOrangeModule { }
