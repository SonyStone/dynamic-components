import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { AbstractContext, Data } from 'store';

// tslint:disable:member-ordering

const testComponents = [
  'test-1',
  'test-2',
  'test-3',
  'test-4',
  'test-5',
]

@Injectable()
@Data({ selector: 'test-components' })
export class TestComponentsContext implements AbstractContext<TestComponentsContext>, OnDestroy {

  type = 0;

  $implicit = testComponents[this.type];

  context$ = new BehaviorSubject<this>(this);

  private subscription = timer(4000, 4000)
    .pipe(
      // take(3),
    )
    .subscribe(() => this.next());

  next = () => {
    this.type++;
    this.type = (this.type !== testComponents.length) ? this.type : 0;

    this.$implicit = testComponents[this.type];

    this.context$.next(this);
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
