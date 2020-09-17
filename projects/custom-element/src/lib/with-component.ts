import { switchMap } from 'rxjs/operators';

import { Type, NgModuleRef, Injectable } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { from } from 'rxjs';

/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithComponent {
  component: Type<any>;
}

@Injectable({
  providedIn: 'root',
})
export class WebComponents {

  create = (selector: string) => switchMap((moduleRef: NgModuleRef<WithComponent>) => {
    const injector = moduleRef.injector;
    const CustomElementComponent = moduleRef.instance.component;
    const CustomElement = createCustomElement(CustomElementComponent, {injector});

    customElements.define(selector, CustomElement);
    return from(customElements.whenDefined(selector));
  })
}
