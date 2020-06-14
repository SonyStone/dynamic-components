import { OnChanges, SimpleChange, SimpleChanges } from '@angular/core';
import { KeyValueChangeRecord } from 'differs';
import { Resettable } from 'object-pool';

export class OnChangesBinding<C extends Partial<OnChanges>> implements Resettable {

  private inputs: Map<string, string>;
  private instance: C | undefined;

  private simpleChanges: SimpleChanges = {}
  private tempSimpleChanges: SimpleChanges = {}

  set(instance: C, inputs: Map<string, string>): void {
    this.reset();

    if (instance.ngOnChanges) {
      this.inputs = inputs;
      this.instance = instance;
    }
  }

  add(change: KeyValueChangeRecord<string, any>): void {
    if (this.instance) {
      const propName = this.inputs.get(change.key);

      if (propName) {
        let simpleChange = this.simpleChanges[propName];

        if (simpleChange) {
          simpleChange.previousValue = change.previousValue;
          simpleChange.currentValue = change.currentValue;
          simpleChange.firstChange = true;
        } else {
          simpleChange = new SimpleChange(
            change.previousValue,
            change.currentValue,
            true,
          );
        }

        this.simpleChanges[propName] = simpleChange;
        this.tempSimpleChanges[propName] = simpleChange;
      }
    }
  }

  change(change: KeyValueChangeRecord<string, any>) {
    if (this.instance) {
      const propName = this.inputs.get(change.key);

      if (propName) {
        let simpleChange = this.simpleChanges[propName];

        if (simpleChange) {
          simpleChange.previousValue = change.previousValue;
          simpleChange.currentValue = change.currentValue;
          simpleChange.firstChange = false;
        } else {
          simpleChange = new SimpleChange(
            change.previousValue,
            change.currentValue,
            false,
          );
        }

        this.simpleChanges[propName] = simpleChange;
        this.tempSimpleChanges[propName] = simpleChange;
      }
    }
  }

  remove(change: KeyValueChangeRecord<string, any>): void {
    if (this.instance) {
      const propName = this.inputs.get(change.key);

      if (propName) {
        let simpleChange = this.simpleChanges[propName];

        if (simpleChange) {
          simpleChange.previousValue = change.previousValue;
          simpleChange.currentValue = change.currentValue;
          simpleChange.firstChange = false;
        } else {
          simpleChange = new SimpleChange(
            change.previousValue,
            change.currentValue,
            false,
          );
        }

        this.simpleChanges[propName] = simpleChange;
        this.tempSimpleChanges[propName] = simpleChange;
      }
    }
  }

  runNgOnChanges(): void {
    if (this.instance) {
      this.instance.ngOnChanges(this.tempSimpleChanges);
      this.tempSimpleChanges = {};
    }
  }

  reset(): void {
    this.inputs = undefined;
    this.instance = undefined;
    this.simpleChanges = {};
    this.tempSimpleChanges = {};
  }
}
