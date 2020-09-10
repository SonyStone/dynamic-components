import { ChangeDetectionStrategy, Component, NgModule, Type } from '@angular/core';
import { StoreModule } from 'store';

import { WithComponent } from './create-component';
import { randomNumber } from './random-number';
import { TestDataContext } from './test-data';

@Component({
  selector: 'app-test-5',
  template: `
  Link app-test-5

  <ng-container *getData="let $implicit from testDataContext
                          let data = data;
                          let test = test;
                          let time = time;
                          let allData = allData;
                          let onAction = onAction;">

    <ng-content select="div"></ng-content>
    <input value="{{ number }}">
    <p>{{ number }}</p>
    <pre>number: {{ number }} {{ time }}</pre>
    <ng-content></ng-content>

    <button (click)="onAction(randomNumber())">time Changes</button>
  </ng-container>
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
export class Test5Component {
  randomNumber = randomNumber;
  number = randomNumber();

  constructor(
    public testDataContext: TestDataContext,
  ) {}
}

@NgModule({
  imports: [
    StoreModule,
  ],
  exports: [Test5Component],
  declarations: [Test5Component],
})
export class Test5Module implements WithComponent<Test5Component> {
  component: Type<Test5Component> = Test5Component;
}
