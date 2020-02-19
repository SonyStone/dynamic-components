import { ChangeDetectorRef, ComponentFactory, ComponentRef, SimpleChange } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BindingDef,
  hasProperty,
  markForCheckWrapper,
  onChangesWrapper,
  PRIVATE_PREFIX,
  PropertyDef,
  toPropertyDef,
} from '../utils';
import { HostAdapter } from './host.adapter';
import { LifecycleComponent } from './lifecycle.strategies';

export class OutletAdapterRef<TComponent> {

  context: Partial<TComponent> = {};

  private changeDetectorRef: ChangeDetectorRef =
    this.componentRef.injector.get(
      ChangeDetectorRef,
      this.componentRef.changeDetectorRef
    );

  private attachedInputs: Subscription[] = [];
  private attachedOutputs: Subscription[] = [];
  private propertyDefs: PropertyDef[] = this.componentFactory.inputs.map(toPropertyDef);
  private bindingDefs: BindingDef[] = [];

  private hostAdapter: HostAdapter<TComponent> = new HostAdapter(this.host);

  constructor(
    public componentFactory: ComponentFactory<TComponent>,
    public componentRef: ComponentRef<TComponent>,
    public host: TComponent,
    private onInitComponentRef: ComponentRef<LifecycleComponent> = componentRef,
    private doCheckComponentRef: ComponentRef<LifecycleComponent> = componentRef,
  ) {

    this.hostAdapter.attach();

    this.attachInputs();
    // this.attachLifecycle();
    // this.attachOutputs();
  }

  dispose(): void {
    this.disposeOutputs();
    this.disposeInputs();

    this.hostAdapter.detach();
    this.hostAdapter = null;

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }

    if (this.onInitComponentRef) {
      this.onInitComponentRef.destroy();
      this.onInitComponentRef = null;
    }

    if (this.doCheckComponentRef) {
      this.doCheckComponentRef.destroy();
      this.doCheckComponentRef = null;
    }
  }

  updateContext(context: Partial<TComponent>): void {

    const contextProps = (context)
      ? Object.keys(context)
      : [];

    for (const contextPropName of contextProps) {
      const bindingDef = this.getBindingDef(contextPropName);
      if (bindingDef) {
        this.detachHostInput(bindingDef);
      }

      const propertyDef = this.getPropertyDef(contextPropName);
      if (propertyDef && this.context[propertyDef.outsidePropName] !== context[contextPropName]) {
        this.context[propertyDef.outsidePropName] = context[contextPropName];
      }
    }

    const unattachedProps = this.propertyDefs.filter(
      (propertyDef) =>
        !(
          contextProps.indexOf(propertyDef.outsidePropName) > -1 ||
          this.getBindingDef(propertyDef.outsidePropName)
        )
    );

    for (const propertyDef of unattachedProps) {
      const bindingDef: BindingDef = this.attachHostInput(propertyDef);
      this.attachInput(bindingDef);
    }
  }

  private getPropertyDef(outsidePropName: string): PropertyDef {
    return this.propertyDefs.find(_ => _.outsidePropName === outsidePropName);
  }

  private getBindingDef(outsidePropName: string): BindingDef {
    return this.bindingDefs.find(_ => _.outsidePropName === outsidePropName);
  }

  private attachHostInput(propertyDef: PropertyDef): BindingDef {
    const bindingDef: BindingDef = this.hostAdapter.attachInput(propertyDef);
    this.bindingDefs.push(bindingDef);
    return bindingDef;
  }

  private detachHostInput(bindingDef: BindingDef): void {
    this.hostAdapter.detachInput(bindingDef);
    this.bindingDefs = this.bindingDefs.filter(_ => _ !== bindingDef);
  }

  private attachInputs(): void {
    this.bindingDefs = [];

    // console.log(`attachInput`, this.propertyDefs);

    for (const propertyDef of this.propertyDefs) {
      const bindingDef: BindingDef = this.attachHostInput(propertyDef);
      this.attachContextPropertyToComponentInput(bindingDef);
      this.attachInput(bindingDef);
    }
  }

  private attachInput(bindingDef: BindingDef) {

    const defaultValue = this.host[bindingDef.outsidePropName];
    if (typeof defaultValue !== 'undefined') {
      this.context[bindingDef.outsidePropName] = defaultValue;
    }

    const subscription = this.hostAdapter.getInputAdapter(bindingDef).changes
      .subscribe(value => {
        this.context[bindingDef.outsidePropName] = value;
      });

    this.attachedInputs.push(subscription);
  }

  private attachContextPropertyToComponentInput(bindingDef: BindingDef): void {
    const { insidePropName, outsidePropName, defaultDescriptor } = bindingDef;

    const context: Partial<TComponent> = this.context;
    const instance: TComponent = this.componentRef.instance;

    Object.defineProperty(context, outsidePropName, {
      get: () => {
        if (defaultDescriptor && defaultDescriptor.get) {
          return defaultDescriptor.get.call(context);
        } else {
          return instance[insidePropName];
        }
      },
      set: (value: any) => {
        if (instance[insidePropName] === value) {
          return void 0;
        }

        let simpleChanges = instance[PRIVATE_PREFIX];

        if (simpleChanges == null) {
          simpleChanges = instance[PRIVATE_PREFIX] = {};
        }

        const isFirstChange = !instance[`${PRIVATE_PREFIX}_${outsidePropName}`];
        instance[`${PRIVATE_PREFIX}_${outsidePropName}`] = true;

        simpleChanges[outsidePropName] = new SimpleChange(
          instance[insidePropName],
          value,
          isFirstChange
        );

        if (defaultDescriptor && defaultDescriptor.set) {
          defaultDescriptor.set.call(context, value);
        }

        instance[insidePropName] = value;
        this.changeDetectorRef.detectChanges();
      },
    });
  }

  private attachLifecycle(): void {
    const instance: TComponent & LifecycleComponent = this.componentRef.instance as any;

    if (hasProperty(this.componentRef.componentType.prototype, 'ngOnChanges')) {
      const markForCheckWrapped = markForCheckWrapper(
        instance.ngDoCheck,
        this.changeDetectorRef
      ).bind(instance);

      this.onInitComponentRef.instance.ngOnInit = onChangesWrapper(instance.ngOnInit).bind(
        instance
      );
      this.doCheckComponentRef.instance.ngDoCheck = onChangesWrapper(markForCheckWrapped).bind(
        instance
      );
    } else {
      this.doCheckComponentRef.instance.ngDoCheck = markForCheckWrapper(
        instance.ngDoCheck,
        this.changeDetectorRef
      ).bind(instance);
    }
  }

  private disposeInputs(): void {
    for (const bindingDef of this.bindingDefs) {
      this.detachHostInput(bindingDef);
    }

    for (const subscription of this.attachedInputs) {
      subscription.unsubscribe();
    }

    this.attachedInputs.splice(0);
  }

  private attachOutputs(): void {
    const propertyDefs = this.componentFactory.outputs.map(toPropertyDef);

    for (const propertyDef of propertyDefs) {
      if (propertyDef.outsidePropName in this.host) {
        const subscription = this.componentRef.instance[propertyDef.insidePropName].subscribe(
          this.host[propertyDef.outsidePropName]
        );
        this.attachedOutputs.push(subscription);
      }
    }
  }

  private disposeOutputs(): void {
    for (const subscription of this.attachedOutputs) {
      subscription.unsubscribe();
    }
    this.attachedOutputs.splice(0);
  }
}
