import { InjectionToken } from '@angular/core';
import { LoadChildrenCallback } from '@angular/router';

// Modules containing custom elements must be set up as lazy-loaded routes (loadChildren)
// TODO(andrewjs): This is a hack, Angular should have first-class support for preparing a module
// that contains custom elements.

export interface CustomElementConfig {
  selector: string;
  load: LoadChildrenCallback;
}

export type CustomElementConfigs = CustomElementConfig[]


/** Injection token to provide the element path modules. */
// export const ELEMENT_MODULE_PATHS_TOKEN = new InjectionToken('aio/elements-map');

/** Map of possible custom element selectors to their lazy-loadable module paths. */
// export const ELEMENT_MODULE_PATHS = new Map<string, () => Promise<any>>();
// ELEMENT_MODULE_PATHS_AS_ROUTES.forEach(route => {
//   ELEMENT_MODULE_PATHS.set(route.selector, route.loadChildren);
// });

/** Injection token to provide the element path modules. */
/** Map of possible custom element selectors to their lazy-loadable module paths. */
export const ELEMENT_MODULE_LOAD = new InjectionToken<CustomElementConfig>('elements')