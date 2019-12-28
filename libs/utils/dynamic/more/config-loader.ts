import { flatten } from '@angular/compiler';
import { Compiler, InjectionToken, Injector, NgModuleFactory } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { Layout, Layouts } from '../layout.interface';
import { LoadChildren } from './load-children.inteface';
import { LoadedLayoutConfig } from './loaded-layout-config';
import { standardizeConfig } from './utils/standardize-config';
import { wrapIntoObservable } from './utils/wrap-into-observable';

/**
 * The [DI token](guide/glossary/#di-token) for a layout configuration.
 * @see `LAYOUTS`
 * @publicApi
 */
export const LAYOUTS = new InjectionToken<Layouts[]>('LAYOUTS');

export class LayoutConfigLoader {
  constructor(
    private compiler: Compiler,
    private onLoadStartListener?: (l: Layout) => void,
    private onLoadEndListener?: (l: Layout) => void,
  ) {}

  load(parentInjector: Injector, layout: Layout): Observable<LoadedLayoutConfig> {
    if (this.onLoadStartListener) {
      this.onLoadStartListener(layout);
    }

    const moduleFactory$ = this.loadModuleFactory(layout.loadChildren);

    return moduleFactory$
      .pipe(
        map((factory: NgModuleFactory<any>) => {
          if (this.onLoadEndListener) {
            this.onLoadEndListener(layout);
          }

          const module = factory.create(parentInjector);

          return new LoadedLayoutConfig(
            flatten(module.injector.get(LAYOUTS)).map(standardizeConfig),
            module,
          );
        }),
      );
  }

  private loadModuleFactory(loadChildren: LoadChildren): Observable<NgModuleFactory<any>> {

    return wrapIntoObservable(loadChildren())
      .pipe(
        mergeMap((t: any) => (t instanceof NgModuleFactory)
          ? of(t)
          : from(this.compiler.compileModuleAsync(t))
        ),
      );
  }
}
