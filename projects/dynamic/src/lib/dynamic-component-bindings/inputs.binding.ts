import { KeyValueChangeRecord } from 'differs';
import { Resettable } from 'object-pool';

export class InputsBinding<C> implements Resettable {

  private inputs: Map<string, string>;
  private instance: C;

  set(instance: C, inputs: Map<string, string>): void {
    this.reset();

    this.instance = instance;
    this.inputs = inputs;
  }

  add(change: KeyValueChangeRecord<string, any>): void {
    const propName = this.inputs.get(change.key);

    if (propName) {
      this.instance[propName] = change.currentValue;
    }
  }

  change(change: KeyValueChangeRecord<string, any>): void {
    const propName = this.inputs.get(change.key);

    if (propName) {
      this.instance[propName] = change.currentValue;
    }
  }

  remove(change: KeyValueChangeRecord<string, any>): void {
    const propName = this.inputs.get(change.key);

    if (propName) {
      this.instance[propName] = undefined;
    }
  }

  reset(): void {
    this.inputs = undefined;
    this.instance = undefined;
  }
}