import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';

import { AppComponentService } from './app-component.service';

@Component({
  selector: 'app-test-2',
  template: `
  Link
  <ng-content select="div"></ng-content>
  <input value="{{ number }}">
  <ng-content></ng-content>
  <ng-container appComponentContainer></ng-container>
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
  providers: [
    AppComponentService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test2Component {
  number = (Math.random() * 100).toFixed();

  constructor(
    public appComponentService: AppComponentService,
  ) {}
}
