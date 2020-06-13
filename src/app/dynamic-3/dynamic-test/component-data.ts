import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EventEmitter,
  Injector,
  OnChanges,
  SimpleChange,
  SimpleChanges,
  Type,
} from '@angular/core';
import { KeyValueDifferWithBounds } from '@factory/utils';
import { Subscription } from 'rxjs';

interface Input {
  propName: string;
  templateName: string;
}

type Output = Input;

export interface Context {
  [key: string]: any
}

export class ComponentData<C extends Partial<OnChanges>> {
  component: Type<C>;
  componentFactoryResolver: ComponentFactoryResolver;
  componentFactory: ComponentFactory<C>;
  componentRef: ComponentRef<C>;
  instance: C;

  inputs: Input[];
  inputMap = new Map<string, Input>();
  outputs: Output[];
  outputMap = new Map<string, Output>();

  changeDetectorRef: ChangeDetectorRef;

  simpleChanges: SimpleChanges = {}

  outputSubscriptions = new Map<string, Subscription>();

  differ = new KeyValueDifferWithBounds<string, any>();

  constructor(
    private injector: Injector,
  ) {}

  init(component: Type<C>, componentFactoryResolver: ComponentFactoryResolver): this {
    this.component = component;
    this.componentFactoryResolver = componentFactoryResolver
    this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.component);
    this.componentRef = this.componentFactory.create(this.injector);
    this.instance = this.componentRef.instance;

    this.differ.reset();

    this.outputSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.outputSubscriptions.clear();

    this.inputs = this.componentFactory.inputs;
    for (const input of this.inputs) {
      this.inputMap.set(input.templateName, input);
      this.differ.bounds.add(input.templateName);
    }

    this.outputs = this.componentFactory.outputs;
    for (const output of this.outputs) {
      this.outputMap.set(output.templateName, output);
      this.differ.bounds.add(output.templateName);
    }

    this.changeDetectorRef =
      this.componentRef.injector.get(ChangeDetectorRef, this.componentRef.changeDetectorRef);

    return this;
  }

  reset(): void {
    this.component = undefined;
    this.componentFactoryResolver = undefined;
    this.componentFactory = undefined;
    this.componentRef = undefined;
    this.instance = undefined;

    this.inputs = undefined;
    this.outputs = undefined;

    this.outputSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.outputSubscriptions.clear();
  }

  update(context: Context): void {
    this.differ.check(context);

    const simpleChanges = {}

    this.differ.changes.forEachAddedItem((change) => {
      if (this.inputMap.has(change.key)) {
        const prop = this.inputMap.get(change.key).propName;
        const value = change.currentValue;
        const simpleChange = new SimpleChange(undefined, value, true);

        this.simpleChanges[prop] = simpleChange;
        simpleChanges[prop] = simpleChange;

        this.instance[prop] = value;
      } else if (this.outputMap.has(change.key)) {
        const prop = this.outputMap.get(change.key).propName;
        const value = change.currentValue;

        const eventEmitter: EventEmitter<any> = this.instance[prop];
        const subscription = eventEmitter.subscribe(($event) => value($event))

        this.outputSubscriptions.set(prop, subscription);
      }
    })

    this.differ.changes.forEachChangedItem((change) => {
      if (this.inputMap.has(change.key)) {
        const prop = this.inputMap.get(change.key).propName;
        const value = change.currentValue;
        const simpleChange = this.simpleChanges[prop];

        if (simpleChange.currentValue !== value) {
          simpleChange.previousValue = simpleChange.currentValue;
          simpleChange.currentValue = value;
          simpleChange.firstChange = false;

          simpleChanges[prop] = simpleChange;
          this.instance[prop] = value;
        }
      } else if (this.outputMap.has(change.key)) {
        const prop = this.outputMap.get(change.key).propName;

        this.outputSubscriptions.get(prop).unsubscribe();

        const value = change.currentValue;
        const eventEmitter: EventEmitter<any> = this.instance[prop];
        const subscription = eventEmitter.subscribe(($event) => value($event))

        this.outputSubscriptions.set(prop, subscription);
      }
    })

    this.differ.changes.forEachRemovedItem((change) => {
      if (this.inputMap.has(change.key)) {
        const prop = this.inputMap.get(change.key).propName;
        const value = undefined;
        const simpleChange = this.simpleChanges[prop];

        simpleChange.previousValue = simpleChange.currentValue;
        simpleChange.currentValue = value;
        simpleChange.firstChange = false;

        simpleChanges[prop] = simpleChange;
        this.instance[prop] = value;
      } else if (this.outputMap.has(change.key)) {
        const prop = this.outputMap.get(change.key).propName;

        this.outputSubscriptions.get(prop)?.unsubscribe();
        this.outputSubscriptions.delete(prop);
      }
    })

    if (this.instance.ngOnChanges) {
      this.instance.ngOnChanges(simpleChanges);
    }

    this.changeDetectorRef.markForCheck();
  }
};