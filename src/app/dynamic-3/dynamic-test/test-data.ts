import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { AbstractContext, Data } from 'store';

// tslint:disable:member-ordering

const testData = [
  'user',
  'user-admin',
  'none',
]

@Injectable()
@Data({ selector: 'test-data' })
export class TestDataContext implements AbstractContext<TestDataContext>, OnDestroy {

  step = 0;

  type = 2;

  $implicit = testData[this.type];

  data1 = `data1 | test | step: ${this.step}`;
  data2 = `data2 | test | step: ${this.step}`;
  data3 = `data3 | test | step: ${this.step}`;

  context$ = new BehaviorSubject<this>(this);

  private subscription = timer(900, 900)
    .subscribe(() => this.next());

  next = () => {
    this.step++;
    this.type++;
    this.type = (this.type !== testData.length) ? this.type : 0;

    this.$implicit = testData[this.type];
    this.data1 = `data1 | user: "${this.$implicit}" | step: ${this.step}`;
    this.data2 = `data2 | user: "${this.$implicit}" | step: ${this.step}`;
    this.data3 = `data3 | user: "${this.$implicit}" | step: ${this.step}`;

    this.allData = this.dataSets[this.type]();

    this.context$.next(this);
  };

  onAction = (value) => {
    console.log(`onAction`, value);
  }

  onClick = (value) => {
    console.log(`onClick`, value);
  }

  otherAction = (value) => {
    console.log(`otherAction`, value, `!!!`);
  }


  dataSets = [
    () => ({
      template1: this.data1,
      template2: this.data2,
      testChanges: this.onAction,
    }),
    () => ({
      template1: this.data1,
      template3: this.data3,
      testChanges: this.onClick,
    }),
    () => ({
      template2: this.data2,
      testChanges: this.otherAction,
    }),
  ]

  allData = this.dataSets[this.type]();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
