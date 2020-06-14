import { EventEmitter } from '@angular/core';
import { KeyValueChangeRecord } from '@factory/utils';
import { Resettable } from 'object-pool';
import { Subscription } from 'rxjs';

export class OutputsBinding<C> implements Resettable {

  private outputs: Map<string, string>;
  private instance: C;

  private outputSubscriptions = new Map<string, Subscription>();

  set(instance: C, outputs: Map<string, string>): void {
    this.reset();

    this.instance = instance;
    this.outputs = outputs;
  }

  add(change: KeyValueChangeRecord<string, any>): void {
    const propName: string | undefined = this.outputs.get(change.key);

    if (propName) {
      const eventEmitter: EventEmitter<any> = this.instance[propName];
      const subscription = eventEmitter.subscribe(($event) => change.currentValue($event))

      this.outputSubscriptions.set(propName, subscription);
    }
  }

  change(change: KeyValueChangeRecord<string, any>): void {
    const propName: string | undefined = this.outputs.get(change.key);

    if (propName) {
      this.outputSubscriptions.get(propName).unsubscribe();

      const eventEmitter: EventEmitter<any> = this.instance[propName];
      const subscription = eventEmitter.subscribe(($event) => change.currentValue($event))

      this.outputSubscriptions.set(propName, subscription);
    }
  }

  remove(change: KeyValueChangeRecord<string, any>): void {
    const propName: string | undefined = this.outputs.get(change.key);

    if (propName) {
      this.outputSubscriptions.get(propName).unsubscribe();
      this.outputSubscriptions.delete(propName);
    }
  }

  reset(): void {
    if (this.outputSubscriptions.size > 0) {
      this.outputSubscriptions.forEach((subscription) => subscription.unsubscribe());
      this.outputSubscriptions.clear();
    }

    this.outputs = undefined;
    this.instance = undefined;
  }
}