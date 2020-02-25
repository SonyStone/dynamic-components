import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  IterableChangeRecord,
  IterableDiffer,
  IterableDiffers,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { DynamicConfig } from '../dynamic/dynamic.config';
import { OutletAdapterRef } from '../ngxd/adapter/adapter-ref';
import { HostAdapter } from '../ngxd/adapter/host.adapter';
import { DynamicChildrenOutletDirective } from './dynamic-children-outlet.directive';

@Directive({
  selector: '[dynamic-outlet]',
})
export class DynamicOutletDirective implements OnChanges, OnDestroy {

  @Input('dynamic-outlet') outeltConfigs: any[];

  private adapterRefs: Map<ChangeDetectorRef, OutletAdapterRef<any>> = new Map();

  private differ: IterableDiffer<any>|null = null;

  private accumulatorMap = new Map<ViewContainerRef, DynamicChildrenOutletDirective[]>();
  private accumulatorKey: ViewContainerRef;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private configService: DynamicConfig,
    private differs: IterableDiffers,
  ) {}

  ngOnChanges(changes: SimpleChanges) {

    if (changes.outeltConfigs) {
      // this.destroyAdapterRef();

      if (!this.outeltConfigs || !Array.isArray(this.outeltConfigs) || this.outeltConfigs.length === 0) {
        return;
      }

      // console.log(`:: outeltConfigs -->`, this.outeltConfigs)

      /** ngFor part */
      {
        if (!this.differ) {
          this.differ = this.differs.find(this.outeltConfigs).create((_: number, item: any) => item.id || item);
        }

        if (this.differ) {
          const iterableChanges = this.differ.diff(this.outeltConfigs);

          // console.log(`iterableChanges`, iterableChanges, this.outeltConfigs);

          iterableChanges.forEachOperation((
            item: IterableChangeRecord<any>,
            adjustedPreviousIndex: number | null,
            currentIndex: number | null) => {
              if (item.previousIndex == null) {
                const index = (currentIndex === null)
                  ? undefined
                  : currentIndex;
                console.log(`viewContainer.createComponent`, index);

                this.createComponent(item.item, index);
              } else if (currentIndex == null) {
                const index = (adjustedPreviousIndex === null)
                  ? undefined
                  : adjustedPreviousIndex;
                console.log(`viewContainer.remove`, index);

                const view = this.viewContainerRef.get(index);
                const adapterRef = this.adapterRefs.get(view);

                this.viewContainerRef.remove(index);
                adapterRef.dispose();
                this.adapterRefs.delete(view);

              } else if (adjustedPreviousIndex !== null) {
                console.log(`viewContainer.move`, adjustedPreviousIndex, currentIndex);

                const view = this.viewContainerRef.get(adjustedPreviousIndex);
                this.viewContainerRef.move(view, currentIndex);
              }
            })
        }
      }
    }
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();

    this.destroyAdapterRef();
  }

  addChild(child: DynamicChildrenOutletDirective): void {
    this.accumulatorMap.get(this.accumulatorKey).push(child);
  }

  private createComponent(outeltConfig: any, index: number = this.viewContainerRef.length): ComponentRef<any> {
        // console.log(
        //   `:: ${outeltConfig.lable} ${outeltConfig.type} -- start -->`,
        //   `\n outeltConfig:`, outeltConfig,
        // );

        const componentType = this.configService.getType(outeltConfig.type).component;

        const componentFactory: ComponentFactory<any> =
          this.componentFactoryResolver.resolveComponentFactory(componentType);

        // console.log(
        //   `\n componentType`,componentFactory.componentType,
        //   `\n inputs`, componentFactory.inputs,
        //   `\n outputs`, componentFactory.outputs,
        //   `\n selector`, componentFactory.selector,
        //   `\n ngContentSelectors`, componentFactory.ngContentSelectors,
        // );

        this.accumulatorKey = this.viewContainerRef;
        // this.accumulatorKey = outeltConfig.type;
        this.accumulatorMap.set(this.accumulatorKey, []);

        const componentRef: ComponentRef<any> = this.viewContainerRef.createComponent(
          componentFactory,
          index,
          this.viewContainerRef.injector,
          undefined,
        );

        const accumulator = this.accumulatorMap.get(this.accumulatorKey);

        const selectors = new Map<string, ComponentRef<any>[]>()

        if (outeltConfig.children) {
          if (!Array.isArray(outeltConfig.children)) {
            for (const key in outeltConfig.children) {
              if (outeltConfig.children.hasOwnProperty(key)) {
                const element = outeltConfig.children[key];

                const set = [];

                for (const selector of element) {
                  const tempComponentRef = this.createComponent(selector);

                  set.push(tempComponentRef);
                  // child.insert(tempComponentRef.hostView);
                }

                selectors.set(key, set);

                accumulator.forEach((directive) => {
                  const components = selectors.get(directive.selector);

                  if(components) {
                    for (const component of components) {
                      directive.insert(component.hostView);
                    }
                  }

                })

              }
            }
          }
        }

        // const { onInitComponentRef, doCheckComponentRef } = resolveLifecycleComponents(
        //   componentFactory.componentType,
        //   this.viewContainerRef,
        //   this.componentFactoryResolver
        // );

        // console.log(`host`, this.changeDetectorRef);

        const hostAdapter: HostAdapter<any> = new HostAdapter(this.changeDetectorRef);
        hostAdapter.attach();


        const adapterRef = new OutletAdapterRef(
          componentFactory,
          componentRef,
          this.changeDetectorRef,
          // onInitComponentRef,
          // doCheckComponentRef,
        );

        // console.log(
        //   `:: ${outeltConfig.lable} ${outeltConfig.type} `,
        //   `\n onInitComponentRef:`, onInitComponentRef,
        //   `\n doCheckComponentRef:`, doCheckComponentRef,
        //   `\n adapterRef:`, adapterRef,
        // );

        // updateContext
        adapterRef.updateContext(outeltConfig as any);

        this.adapterRefs.set(componentRef.changeDetectorRef, adapterRef);

        return componentRef;

        // console.log(`:: ${outeltConfig.lable} ${outeltConfig.type} <-- end --`);
  }

  private destroyAdapterRef() {
    if (this.adapterRefs) {
      for (const [_, adapterRef] of this.adapterRefs) {
        adapterRef.dispose();
      }
      this.adapterRefs.clear();
    }
  }
}
