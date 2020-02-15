import { InjectionToken, Type } from '@angular/core';
import { LoadChildrenCallback } from '@angular/router';

// Modules containing custom elements must be set up as lazy-loaded routes (loadChildren)
// TODO(andrewjs): This is a hack, Angular should have first-class support for preparing a module
// that contains custom elements.
export const ELEMENT_MODULE_LOAD_CALLBACKS = [
  {
    selector: 'app-test-1',
    loadChildren: () => import('../custom-elements/test-1/test-1.component')
      .then((m) => m.Test1Module)
  },
  {
    selector: 'app-test-2',
    loadChildren: () => import('../custom-elements/test-2/test-2.component')
      .then((m) => m.Test2Module)
  },
];

/**
 * Interface expected to be implemented by all modules that declare a component that can be used as
 * a custom element.
 */
export interface WithCustomElementComponent {
  customElementComponent: Type<any>;
}

/** Injection token to provide the element path modules. */
// export const ELEMENT_MODULE_PATHS_TOKEN = new InjectionToken('aio/elements-map');

/** Map of possible custom element selectors to their lazy-loadable module paths. */
// export const ELEMENT_MODULE_PATHS = new Map<string, () => Promise<any>>();
// ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
//   ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
// });

/** Injection token to provide the element path modules. */
export const ELEMENT_MODULE_LOAD_CALLBACKS_TOKEN = new InjectionToken<Map<string, LoadChildrenCallback>>('aio/elements-map', {
  providedIn: 'root',
  factory: () => {
    /** Map of possible custom element selectors to their lazy-loadable module paths. */
    const elementModuleLoadCallbacks = new Map<string, LoadChildrenCallback>();

    ELEMENT_MODULE_LOAD_CALLBACKS.forEach(route => {
      elementModuleLoadCallbacks.set(route.selector, route.loadChildren);
    });

    return elementModuleLoadCallbacks;
  }
});
