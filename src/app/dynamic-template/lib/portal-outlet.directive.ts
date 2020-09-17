import { Compiler, Directive, Inject, Injector, OnDestroy, Provider, ViewContainerRef } from '@angular/core';
import { CONSOLE } from 'doc-viewer';
import { NgModulePortal, resolveDynamicModule } from 'dynamic';
import { forkJoin, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Test2Module } from '../test-2/test-2.module';
import { Test3Component } from '../test-2/test-3.component';
import { Test4Component } from '../test-2/test-4.component';


// tslint:disable:only-arrow-functions

export function test(compiler) {
  return ({
    names: ['component-1', 'template-2', 'template-1'],
    load: () => import('../test-1')
      .then((m) => resolveDynamicModule(m.Test1Module)
        .withComponent(m.Test2Component, 'component-1')
        .withTemplates(m.Test1Component, ['template-2', 'template-1'])
      ),
  });
}

const dynamicTemplatesProviders: Provider[] = [
  {
    provide: 'test',
    useFactory: test,
    deps: [Compiler],
  }
];


// tslint:disable:directive-selector

@Directive({
  selector: '[portalOutlet]',
  providers: [
    dynamicTemplatesProviders,
  ],
})
export class PortalOutletDirective implements OnDestroy {

  sub2 = from(this.testLoader.load())
    .pipe(
      tap((v) => this.console.log(`log-name`, v)),
    )
    .subscribe(() => {});

  sub = of(Test2Module)
    .pipe(
      map((module) =>
        NgModulePortal.withModule(module)
          .withComponent(Test3Component, 'test-3-component')
          .withTemplates(Test4Component, ['test-3-template', 'test-4-template'])
      ),
      // Компилируем? модуль (Почему компилируем, почему это называется компиляция?)
      // нужен, чтобы появился ComponentFactory
      switchMap((modulePortal) => from(modulePortal.compile(this.compiler))),
      map((modulePortal) => modulePortal.create(this.injector)),
      switchMap((modulePortal) => forkJoin(modulePortal.types.map((type) => type.create()))),
      map((typeHolders) => {
        for (const holder of typeHolders) {

          holder.attach(this.viewContainer);
        }
      }),
    )
    .subscribe();

  constructor(
    @Inject('test') private testLoader: any,
    private injector: Injector,
    private compiler: Compiler,
    private viewContainer: ViewContainerRef,
    @Inject(CONSOLE) private console: Console,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
