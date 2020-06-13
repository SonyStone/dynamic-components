import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Type,
  SimpleChanges,
  ChangeDetectorRef,
} from '@angular/core';
import { randomNumber } from './random-number';

// tslint:disable:no-input-rename

@Component({
  selector: 'app-test-1',
  template: `
  Link app-test-1
  <ng-content select="div"></ng-content>
  <input [value]="number">
  <p>{{ number }}</p>
  <pre>prop1: {{ prop1 }}</pre>
  <pre>prop2: {{ prop2 }}</pre>
  <ng-content></ng-content>

  <button (click)="changeTime()">time Changes</button>
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
export class Test1Component implements OnChanges, OnInit, OnDestroy {
  number = randomNumber()

  @Input('template1') prop1 = 'empty 1';
  @Input('template2') prop2 = 'empty 2';

  // tslint:disable-next-line:no-output-rename
  @Output('testChanges') timeChanges = new EventEmitter<string>()

  constructor(
    public cd: ChangeDetectorRef,
  ) {}

  ngOnChanges({ prop1, prop2 }: SimpleChanges): void {
    // console.log(
    //   `Test4 On Changes`,
    //   `\nprop1`, prop1,
    //   `\nprop1`, prop2,
    //   `\nthis`, this,
    // )
  }

  ngOnInit(): void {
    // console.log(`Test4 On Init`)
  }
  ngOnDestroy(): void {
    // console.log(`Test4 On Destroy`)
  }

  changeTime(): void {
    this.timeChanges.emit(randomNumber());
  }
}



@NgModule({
  exports: [Test1Component],
  declarations: [Test1Component],
})
export class Test1Module {
  component: Type<any> = Test1Component;
}
