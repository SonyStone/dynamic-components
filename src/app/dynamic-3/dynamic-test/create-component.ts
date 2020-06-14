import { Compiler, NgModuleFactory, NgModuleRef, Type, ViewContainerRef } from '@angular/core';
import { functionUnpacking } from 'dynamic';
import { from, of } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { switchToObservable } from 'store';

export interface WithComponent<T> {
  component: Type<T>;
}

export const createComponent = <C>(options: {
  module: WithComponent<C>,
  viewContainer: ViewContainerRef,
  compiler: Compiler,
  moduleRef: NgModuleRef<C>,
}): void => {

  const { module, viewContainer, compiler, moduleRef: ngModuleRef } = options;

  of(module)
    .pipe(
      filter((moduleOrFactory) => !!moduleOrFactory),
      functionUnpacking(),
      switchToObservable(),
      switchMap((moduleOrFactory) => (moduleOrFactory instanceof NgModuleFactory
        ? of(moduleOrFactory)
        : from(compiler.compileModuleAsync(moduleOrFactory))),
      ),
      map((moduleFactory) => moduleFactory.create(ngModuleRef.injector)),
      map((moduleRef) =>  {
        const component = moduleRef.instance.component;

        const injector = moduleRef.injector;
        const componentFactoryResolver = moduleRef.componentFactoryResolver
        const componentFactory = componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = componentFactory.create(injector);

        return componentRef;
      })
    )
    .subscribe((componentRef) => {
      const index = viewContainer.length;

      viewContainer.insert(componentRef.hostView, index);

      componentRef.changeDetectorRef.markForCheck();
    })
}