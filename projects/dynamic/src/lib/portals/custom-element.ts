import { Injector, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { createCustomElement } from '@angular/elements';

export class CustomElement<E> {
  injector: Injector;
  component: Type<E>;
  selector: string;
  moduleRef: NgModuleRef<any>;

  create(): Promise<this> {
    const injector = this.injector;
    const CustomElementComponent = this.component;
    const selector = this.selector;

    const NgElementConstructor = createCustomElement(CustomElementComponent, {injector});

    customElements.define(selector, NgElementConstructor);

    return customElements.whenDefined(selector).then(() => this);
  }

  attach(viewContainer: ViewContainerRef, index?: number): void {
    // const ref = this.ref;

    // const viewRef = this.ref.createEmbeddedView({});

    // document.create
  }
}
