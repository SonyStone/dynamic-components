import { ChangeDetectorRef, ComponentFactory, ComponentRef, Injector, OnChanges } from '@angular/core';
import { KeyValueDifferWithBounds } from '@factory/utils';
import { Resettable } from 'object-pool';

import { Context } from './context.interface';
import { InputsBinding } from './inputs.binding';
import { OnChangesBinding } from './on-changes.binding';
import { OutputsBinding } from './outputs.binding';


export class DynamicComponentBindings<C extends Partial<OnChanges>> implements Resettable {
  componentRef: ComponentRef<C>;
  instance: C;

  changeDetectorRef: ChangeDetectorRef;

  private differ = new KeyValueDifferWithBounds<string, any>();

  private inputs = new Map<string, string>();
  private inputsBindings = new InputsBinding();
  private onChangesBindings = new OnChangesBinding();

  private outputs = new Map<string, string>();
  private outputsBindings = new OutputsBinding();

  set(componentFactory: ComponentFactory<C>, injector: Injector): this {
    this.reset();

    this.componentRef = componentFactory.create(injector);
    this.instance = this.componentRef.instance;

    this.inputsBindings.set(this.instance, this.inputs);
    this.onChangesBindings.set(this.instance, this.inputs)

    for (const input of componentFactory.inputs) {
      this.inputs.set(input.templateName, input.propName);
      this.differ.bounds.add(input.templateName);
    }

    this.outputsBindings.set(this.instance, this.outputs);

    for (const output of componentFactory.outputs) {
      this.outputs.set(output.templateName, output.propName);
      this.differ.bounds.add(output.templateName);
    }

    this.changeDetectorRef =
      this.componentRef.injector.get(ChangeDetectorRef, this.componentRef.changeDetectorRef);

    return this;
  }

  update(context: Context): void {
    this.differ.check(context);

    this.differ.changes.forEachAddedItem((change) => {
      this.inputsBindings.add(change);
      this.onChangesBindings.add(change);
      this.outputsBindings.add(change);
    })

    this.differ.changes.forEachChangedItem((change) => {
      this.inputsBindings.change(change)
      this.onChangesBindings.change(change);
      this.outputsBindings.change(change);
    })

    this.differ.changes.forEachRemovedItem((change) => {
      this.inputsBindings.remove(change)
      this.onChangesBindings.remove(change);
      this.outputsBindings.remove(change)
    })

    this.onChangesBindings.runNgOnChanges();

    this.changeDetectorRef.markForCheck();
  }

  reset(): void {
    this.componentRef = undefined;
    this.instance = undefined;
    this.changeDetectorRef = undefined;

    this.differ.check({});
    this.inputs.clear();
    this.outputs.clear();
  }
};