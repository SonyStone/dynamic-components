import { ComponentRef, Injectable, ViewRef } from '@angular/core';

@Injectable()
export class ComponentCacheService {

  cache: Map<string, ComponentRef<any>> = new Map();

  inUse: Set<ViewRef> = new Set();

  constructor() { }

  has(
    id: string,
    yes: (componentRef: ComponentRef<any>) => void,
    no: () => ComponentRef<any>,
  ): ComponentRef<any> {
    if (this.cache.has(id)) {
      const componentRef = this.cache.get(id);
      this.inUse.add(componentRef.hostView);

      yes(componentRef);

      return componentRef;
    } else {
      const componentRef = no()
      this.cache.set(id, componentRef);
      this.inUse.add(componentRef.hostView);

      return componentRef;
    }
  }

  isUsing(viewRef: ViewRef, yes: () => void, no: () => void): void {
    if (this.inUse.has(viewRef)) {
      this.inUse.delete(viewRef);

      yes();
    } else {
      no();
    }
  }
}
