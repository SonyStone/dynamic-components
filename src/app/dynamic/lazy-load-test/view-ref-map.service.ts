import { ComponentRef, Injectable, Injector, NgModuleFactory, NgModuleRef, ViewContainerRef } from '@angular/core';
import { DynamicConfig } from '@factory/utils';

@Injectable({
  providedIn: 'root'
})
export class ComponentRefMapService {
  componentRefs = new Map<string, ComponentRef<unknown>>();

  ngModuleRef: NgModuleRef<any>;
  viewContainerRef: ViewContainerRef;

  constructor(
    private injector: Injector,
    private dynamicConfig: DynamicConfig,
  ) { }

  get(ngModuleFactory: NgModuleFactory<any>): ComponentRef<unknown> {

    if (!this.ngModuleRef) {
      this.ngModuleRef = ngModuleFactory.create(this.injector);
    }

    const type = this.dynamicConfig.getType('lazy-test-1');

    if (this.componentRefs.has(type.name)) {

      const componentRef = this.componentRefs.get(type.name);

      return componentRef;

    } else {

      console.log(`component`, type.component);

      const factory =
        this.ngModuleRef.componentFactoryResolver.resolveComponentFactory(type.component);

      const componentRef = factory.create(this.injector);

      this.componentRefs.set(type.name, componentRef);

      // componentRef.hostView.detach();
      console.log(`componentRef hostView`, componentRef.hostView, );

      componentRef.onDestroy(() => {
        console.log(`componentRef on destroy`, componentRef.hostView.destroyed, );
      });

      return componentRef;
    }
  }

  detachAll(): void {
    this.componentRefs.forEach((componentRef) => componentRef)
  }
}
