import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';

import { OutletAdapterRef } from '../ngxd/adapter/adapter-ref';
import { HostAdapter } from '../ngxd/adapter/host.adapter';
import { ComponentCacheService } from './component-cache.service';
import { DynamicChildrenOutletDirective } from './dynamic-children-outlet.directive';
import { DynamicConfig } from './dynamic.config';
import { OuteltConfig } from './outelt-config.interface';


@Injectable()
export class ComponentCreaterService implements OnDestroy {

  adapterRefs: Map<ChangeDetectorRef, OutletAdapterRef<any>> = new Map();
  changeDetectorRef: ChangeDetectorRef;

  private accumulatorMap = new Map<ViewContainerRef, DynamicChildrenOutletDirective[]>();
  private accumulatorKey: ViewContainerRef;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private configService: DynamicConfig,
    private componentCacheService: ComponentCacheService,
  ) {}

  ngOnDestroy() {
    this.destroyAdapterRef();
  }

  createComponent(
    outeltConfig: OuteltConfig,
    index: number = this.viewContainerRef.length
  ): ComponentRef<any> {
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


    // create component instance
    const componentRef: ComponentRef<any> =
      this.handleCache(
        outeltConfig,
        index,
        () => this.viewContainerRef.createComponent(
          componentFactory,
          index,
          this.viewContainerRef.injector,
          undefined,
        ),
    );

    this.handleChildren(outeltConfig);

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

  removeComponent(index: number): void {
    const view = this.viewContainerRef.get(index);
    const adapterRef = this.adapterRefs.get(view);

    this.componentCacheService.isUsing(
      view,
      () => {
        this.viewContainerRef.detach(index);
      },
      () => {

        this.viewContainerRef.remove(index);
        adapterRef.dispose();
        this.adapterRefs.delete(view);
      },
    );
  }

  moveComponent(previousIndex: number, currentIndex: number): void {
    const view = this.viewContainerRef.get(previousIndex);
    this.viewContainerRef.move(view, currentIndex);
  }

  addChild(child: DynamicChildrenOutletDirective): void {
    this.accumulatorMap.get(this.accumulatorKey).push(child);
  }

  private destroyAdapterRef() {
    if (this.adapterRefs) {
      for (const [_, adapterRef] of this.adapterRefs) {
        adapterRef.dispose();
      }
      this.adapterRefs.clear();
    }
  }

  private handleCache(
    outeltConfig: OuteltConfig,
    index: number,
    createComponent: () => ComponentRef<any>,
  ): ComponentRef<any> {

    if (!outeltConfig.cacheId) {
      const componentRef = createComponent();

      return componentRef
    }

    return this.componentCacheService.has(
      outeltConfig.cacheId,
      (componentRef) => {
        this.viewContainerRef.insert(componentRef.hostView, index);
      },
      () => {
        return createComponent();
      },
    );
  }

  private handleChildren(outeltConfig: OuteltConfig): void {
    if (!outeltConfig.children) {
      return;
    }

    const accumulator = this.accumulatorMap.get(this.accumulatorKey);

    const selectors = new Map<string, ComponentRef<any>[]>();

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
              for (const componentRef of components) {
                directive.insert(componentRef.hostView);
              }
            }

          })

        }
      }
    }
  }
}