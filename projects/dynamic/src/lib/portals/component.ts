import {
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injector,
  NgModuleRef,
  Type,
  ViewRef,
  ViewContainerRef,
} from '@angular/core';

export class ComponentPortal<C> {
  type: Type<C>;
  moduleRef: NgModuleRef<any>;
  factory: ComponentFactory<C>;
  ref: ComponentRef<C>;

  /**
   * создаём (находим в случае compileModuleAndAllComponents)
   * factory в любом случае должен быть создан внутри своего модуля, так как все зависимости находятся тоже в нём.
   * либо, если используется компонент без модуля.
   */
  createFactory(componentFactoryResolver: ComponentFactoryResolver = this.moduleRef.componentFactoryResolver): ComponentPortal<C> {
    this.factory = componentFactoryResolver.resolveComponentFactory(this.type);

    return this;
  }

  /**
   * создавать компонентом можно сколько угодно, потому имеет мало смысла хранить только один в `ref`
   * только в случае singleton компонента для templates хранилища.
   * @param injector DI
   * @param projectableNodes projectable nodes into ng-context
   * @param rootSelectorOrNode Render element or CSS selector to locate the element.
   * @param ngModule зачем он нужен?
   */
  createComponent(
    injector: Injector = this.moduleRef.injector,
    projectableNodes?: any[][],
    rootSelectorOrNode?: any,
    ngModule?: NgModuleRef<any>,
  ): ComponentRef<C> {

    this.ref = this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule);

    return this.ref;
  }

  create(): Promise<this> {
    this.createFactory();
    this.createComponent();

    return new Promise((resolve) => resolve(this));
  }

  attach(viewContainer: ViewContainerRef, index?: number): ViewRef {
    const viewRef = viewContainer.createComponent(this.factory, index, this.moduleRef.injector);

    viewRef.changeDetectorRef.markForCheck();

    return viewRef.hostView;
  }
}
