import { Injectable, Injector } from '@angular/core';
import { Compiler } from 'dynamic';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { switchToObservable } from 'store';

import { CustomElementConfig } from './custom-element-registry';
import { LoadCallback } from './load-callback.interface';
import { WebComponents, WithComponent } from './with-component';

@Injectable({
  providedIn: 'root'
})
export class CustomElementLoader {

  /** Map of unregistered custom elements and their respective module paths to load. */
  private elementsToLoad = new Map<string, LoadCallback>();
  /** Map of custom elements that are in the process of being loaded and registered. */
  private elementsLoading = new Map<string, Observable<void>>();

  constructor(
    private compiler: Compiler<WithComponent>,
    private webComponents: WebComponents,
    private injector: Injector,
  ) {}

  addConfig(config: CustomElementConfig): void {
    const { selector, load } = config;

    if (this.elementsToLoad.has(selector)) {
      return;
    }

    this.elementsToLoad.set(selector, load);
  }

  /**
   * Queries the provided element for any custom elements that have not yet been registered with
   * the browser. Custom elements that are registered will be removed from the list of unregistered
   * elements so that they will not be queried in subsequent calls.
   */
  loadContainedCustomElements(element: HTMLElement, injector: Injector = this.injector): Observable<void> {
    const unregisteredSelectors = Array.from(this.elementsToLoad.keys())
        .filter(s => element.querySelector(s));

    if (!unregisteredSelectors.length) { return of(undefined); }

    // Returns observable that completes when all discovered elements have been registered.
    return forkJoin(unregisteredSelectors.map(s => this.loadCustomElement(s, injector)))
      .pipe(mapTo(undefined));
  }

  /** Loads and registers the custom element defined on the `WithCustomElement` module factory. */
  loadCustomElement(selector: string, injector: Injector = this.injector): Observable<void> {
    if (this.elementsLoading.has(selector)) {
      // The custom element is in the process of being loaded and registered.
      return this.elementsLoading.get(selector);
    }

    // Load and register the custom element (for the first time).
    const modulePathLoader = this.elementsToLoad.get(selector);

    if (modulePathLoader) {

      const loadedAndRegistered = of(modulePathLoader())
        .pipe(
          switchToObservable(),
          this.compiler.compileModuleAsync,
          map((moduleFactory) => moduleFactory.create(injector)),
          this.webComponents.create(selector),
          tap(() => {
            // The custom element has been successfully loaded and registered.
            // Remove from `elementsLoading` and `elementsToLoad`.
            this.elementsLoading.delete(selector);
            this.elementsToLoad.delete(selector);
          }),
          catchError((error) => {
            // The custom element has failed to load and register.
            // Remove from `elementsLoading`.
            // (Do not remove from `elementsToLoad` in case it was a temporary error.)
            this.elementsLoading.delete(selector);

            return of(error)
          })
        )

      this.elementsLoading.set(selector, loadedAndRegistered);

      return loadedAndRegistered;
    }

    // The custom element has already been loaded and registered.
    return EMPTY;
  }
}
