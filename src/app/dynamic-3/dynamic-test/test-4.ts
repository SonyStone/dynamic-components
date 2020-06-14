import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  Type,
} from '@angular/core';

import { WithComponent } from './create-component';
import { randomNumber } from './random-number';

@Component({
  selector: 'app-test-4',
  template: `
  Link app-test-4
  <ng-content select="div"></ng-content>
  <input [value]="number">
  <pre>template1 + template2: {{ prop1 }}</pre>
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
export class Test4Component implements OnChanges, OnInit, OnDestroy {
  number = randomNumber()

  @Input() template1 = 'empty 1';
  @Input() template2 = 'empty 2';

  prop1: string;

  ngOnChanges({ template1, template2 }: SimpleChanges): void {
    if (template1 || template2) {
      this.prop1 = `${this.template1} :: ${this.template2}`
    }
    // console.log(`Test4 On Changes`)
  }
  ngOnInit(): void {
    // console.log(`Test4 On Init`)
  }
  ngOnDestroy(): void {
    // console.log(`Test4 On Destroy`)
  }
}

@NgModule({
  exports: [Test4Component],
  declarations: [Test4Component],
})
export class Test4Module implements WithComponent<Test4Component> {
  component: Type<Test4Component> = Test4Component;
}
