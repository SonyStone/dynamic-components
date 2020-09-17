import { Compiler, Injector, NgModuleRef, Type } from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';

import { ComponentPortal } from './component';
import { CustomElement } from './custom-element';
import { TemplatePortal } from './template';
import { TypeHolder } from './type-holder.interface';

export const resolveDynamicModule = <M>(module: Type<M>) => NgModulePortal.withModule(module);

const modulesSet = new Set();

export class NgModulePortal<M> {
  module: Type<M>;
  moduleFactory: NgModuleFactory<M>;
  moduleRef: NgModuleRef<M>;
  injector: Injector;

  types: TypeHolder[] = [];
  selectors: Map<string, TypeHolder> = new Map();

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

  withComponent<C>(component: Type<C>, selector: string): this {
    const componentPortal = new ComponentPortal();
    componentPortal.type = component;

    this.types.push(componentPortal);
    this.selectors.set(selector, componentPortal);

    return this;
  }

  withTemplates<T>(component: Type<T>, selectors: string[]): this {
    const componentPortal = new ComponentPortal();
    componentPortal.type = component;

    const templatePortal = new TemplatePortal();
    templatePortal.hostComponent = componentPortal;
    templatePortal.selectors = selectors;

    this.types.push(templatePortal);
    for (const name of selectors) {
      this.selectors.set(name, templatePortal);
    }

    return this;
  }

  withCustomElement<C>(component: Type<C>, selector: string): this {
    const customElement = new CustomElement();
    customElement.component = component;
    customElement.selector = selector;

    this.types.push(customElement);
    this.selectors.set(selector, customElement);

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

    for (const type of this.types) {
      type.moduleRef = this.moduleRef;
    }

    return this;
  }

  destroy(): void {
    modulesSet.delete(this.module);
    this.module = undefined;
    this.moduleFactory = undefined;
    this.moduleRef = undefined;
    this.injector = undefined;
    this.types = [];
    this.selectors.clear();
  }
}



