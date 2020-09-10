import {
  Compiler,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  NgModuleRef,
  TemplateRef,
  Type,
  ViewRef,
} from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';

export const resolveDynamicModule = <M>(module: Type<M>) => NgModulePortal.withModule(module);

const modulesSet = new Set();

export class NgModulePortal<M> {
  module: Type<M>;
  moduleFactory: NgModuleFactory<M>;
  moduleRef: NgModuleRef<M>;
  injector: Injector;

  components: Map<string, ComponentPortal<any>> = new Map();

  templates: Map<string, TemplatePortal<any>> = new Map();

  portals: Map<string, TemplatePortal<any> | ComponentPortal<any>> = new Map();

  static withModule<M>(module: Type<M>): NgModulePortal<M> {
    const portal = new NgModulePortal<M>();

    return portal.init(module);
  }

  init(module: Type<M>): this {
    this.module = module;

    if (modulesSet.has(module)) {
      throw new Error(`Module portal shuold be created only once`);
    }
    modulesSet.add(module);

    return this;
  }

  withComponent<C>(component: Type<C>, name: string): this {
    const componentPortal = new ComponentPortal();
    componentPortal.type = component;
    this.components.set(name, componentPortal);

    return this;
  }

  withTemplates<T>(component: Type<T>, names: string[]): this {

    return this;
  }

  /** step 1 -- compile module, create module factory */
  compile(compiler: Compiler): Promise<this> {
    return compiler.compileModuleAsync(this.module)
      .then((moduleFactory) => {
        this.moduleFactory = moduleFactory;

        return this;
      })
      .catch(() => this);
  }

  /** step 2 -- create module ref */
  create(injector: Injector): this {
    this.injector = injector;
    this.moduleRef = this.moduleFactory.create(injector);
    return this;
  }

  destroy(): void {
    modulesSet.delete(module);
    this.module = undefined;
    this.moduleFactory = undefined;
    this.moduleRef = undefined;
    this.injector = undefined;
    this.components.clear();
    this.templates.clear();
    this.portals.clear();
  }
}

export class ComponentPortal<C> {
  type: Type<C>;
  moduleRef: NgModuleRef<any>;
  factory: ComponentFactory<C>;
  ref: ComponentRef<C>;
  injector: Injector;
  viewRef: ViewRef;

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

    console.log(`this.factory`, this.factory);

    this.ref = this.factory.create(injector, projectableNodes, rootSelectorOrNode, ngModule);

    return this.ref;
  }
}

export class TemplatePortal<T> {
  tag: string;
  ref: TemplateRef<T>;
  viewRef: EmbeddedViewRef<T>;
}