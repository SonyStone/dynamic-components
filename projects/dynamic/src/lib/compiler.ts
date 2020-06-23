import { Compiler as NgCompiler, Injectable, NgModuleFactory, Type } from '@angular/core';
import { from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class Compiler<T> {
  constructor(
    private compiler: NgCompiler,
  ) {}

  /**
   * With View Engine, the NgModule factory is created and provided when loaded.
   * With Ivy, only the NgModule class is provided loaded and must be compiled.
   * This uses the same mechanism as the deprecated `SystemJsNgModuleLoader` in
   * in `packages/core/src/linker/system_js_ng_module_factory_loader.ts`
   * to pass on the NgModuleFactory, or compile the NgModule and return its NgModuleFactory.
   */
  compileModuleAsync = switchMap((moduleOrFactory: Type<T> | NgModuleFactory<T>) =>
    moduleOrFactory instanceof NgModuleFactory
      ? of(moduleOrFactory)
      : from(this.compiler.compileModuleAsync(moduleOrFactory))
    );

  compileModuleAndAllComponentsAsync = switchMap((moduleOrFactory: Type<T> | NgModuleFactory<T>) =>
    moduleOrFactory instanceof NgModuleFactory
      ? of(moduleOrFactory)
      : from(this.compiler.compileModuleAndAllComponentsAsync(moduleOrFactory))
    );
}