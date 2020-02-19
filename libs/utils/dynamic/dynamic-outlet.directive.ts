import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';

import { DynamicConfig } from '../dynamic/dynamic.config';
import { OutletAdapterRef } from '../ngxd/adapter/adapter-ref';
import { resolveLifecycleComponents } from '../ngxd/adapter/lifecycle.strategies';
import { OuteltConfig } from './outlet-config.interface';
import { HostAdapter } from '../ngxd/adapter/host.adapter';

@Directive({
  selector: '[dynamicOutlet]',
})
export class DynamicOutletDirective implements OnChanges, OnDestroy {

  @Input('dynamicOutlet') outeltConfigs: OuteltConfig[];

  private adapterRefs: OutletAdapterRef<any>[] = [];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private configService: DynamicConfig,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.outeltConfigs) {
      this.destroyAdapterRef();

      if (!this.outeltConfigs) {
        return;
      }

      console.log(`:: outeltConfigs -->`, this.outeltConfigs)

      for (const outeltConfig of this.outeltConfigs) {

        console.log(
          `:: ${outeltConfig.lable} ${outeltConfig.type} -- start -->`,
          `\n outeltConfig:`, outeltConfig,
        );

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

        const componentRef: ComponentRef<any> = this.viewContainerRef.createComponent(
          componentFactory,
          this.viewContainerRef.length,
          this.viewContainerRef.injector,
          undefined,
        );

        const { onInitComponentRef, doCheckComponentRef } = resolveLifecycleComponents(
          componentFactory.componentType,
          this.viewContainerRef,
          this.componentFactoryResolver
        );

        console.log(`host`, this.changeDetectorRef);

        const hostAdapter: HostAdapter<any> = new HostAdapter(this.changeDetectorRef);
        hostAdapter.attach();


        const adapterRef = new OutletAdapterRef(
          componentFactory,
          componentRef,
          this.changeDetectorRef,
          onInitComponentRef,
          doCheckComponentRef,
        );

        console.log(
          `:: ${outeltConfig.lable} ${outeltConfig.type} `,
          `\n onInitComponentRef:`, onInitComponentRef,
          `\n doCheckComponentRef:`, doCheckComponentRef,
          `\n adapterRef:`, adapterRef,
        );

        // updateContext
        adapterRef.updateContext(outeltConfig as any);

        this.adapterRefs.push(adapterRef);

        console.log(`:: ${outeltConfig.lable} ${outeltConfig.type} <-- end --`);
      }
    }
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();

    this.destroyAdapterRef();
  }

  private destroyAdapterRef() {
    if (this.adapterRefs) {
      for (const adapterRef of this.adapterRefs) {
        adapterRef.dispose();
      }
      this.adapterRefs = [];
    }
  }
}
