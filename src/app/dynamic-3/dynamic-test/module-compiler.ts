import { Compiler, Injectable, NgModuleFactory, Type } from '@angular/core';
import { from, of, OperatorFunction, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AsyncLike, switchToObservable } from 'store';

// tslint:disable:ban-types
const isFunctionNotClass = (func: unknown): func is (() => {}) => !/^class\s/.test(Function.prototype.toString.call(func));

export const functionUnpacking = <F>(): OperatorFunction<(() => F) | F, any> =>
  map((module) => (typeof module === 'function')
    ? (isFunctionNotClass(module))
      ? module()
      : module
    : module
  );

@Injectable({
  providedIn: 'root'
})
export class ModuleCompiler<M> {
  constructor(
    private compiler: Compiler,
  ) { }

  compile = (): OperatorFunction<() => Promise<NgModuleFactory<M>> | AsyncLike<Type<M>>, NgModuleFactory<M>> =>
    pipe(
      functionUnpacking(),
      switchToObservable(),
      /**
       * With View Engine, the NgModule factory is created and provided when loaded.
       * With Ivy, only the NgModule class is provided loaded and must be compiled.
       * This uses the same mechanism as the deprecated `SystemJsNgModuleLoader` in
       * in `packages/core/src/linker/system_js_ng_module_factory_loader.ts`
       * to pass on the NgModuleFactory, or compile the NgModule and return its NgModuleFactory.
       */
      switchMap((moduleOrFactory) => (moduleOrFactory instanceof NgModuleFactory
        ? of(moduleOrFactory)
        : from(this.compiler.compileModuleAsync(moduleOrFactory))),
      ),
    )
}
