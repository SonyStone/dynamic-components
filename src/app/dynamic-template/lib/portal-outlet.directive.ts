import { Compiler, Directive, Inject, Injector, OnDestroy, Provider, ViewContainerRef } from '@angular/core';
import { CONSOLE } from 'doc-viewer';
import { ComponentPortal, resolveDynamicModule, NgModulePortal, TemplatePortal } from 'dynamic';
import { from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Test2Module } from '../test-2/test-2.module';
import { ConfigService } from './config.service';
import { ComponentTypeOption, TemplateTypeOption } from './dynamic-config';
import { TemplatesService } from './templates.service';


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

const isTemplateTypeOption = (type: TemplateTypeOption | ComponentTypeOption): type is TemplateTypeOption =>
  !!(type as TemplateTypeOption)?.names;

const isComponentTypeOption = (type: TemplateTypeOption | ComponentTypeOption): type is ComponentTypeOption =>
  !!((type as ComponentTypeOption)?.name);

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
      map((module) => NgModulePortal.withModule(module)),
      // Компилируем? модуль (Почему компилируем, почему это называется компиляция?)
      // нужен, чтобы появился ComponentFactory
      switchMap((modulePortal) => from(modulePortal.compile(this.compiler))),
      map((modulePortal) => modulePortal.create(this.injector)),
      map((modulePortal) => {

        for (const type of this.config.config.types) {
          if (isTemplateTypeOption(type)) {
            const { component, names } = type;

            const componentPortal = new ComponentPortal();

            // имеем класс (type) компонента
            componentPortal.type = component;
            componentPortal.moduleRef = modulePortal.moduleRef;

            componentPortal.createFactory();

            componentPortal.createComponent();

            componentPortal.ref = componentPortal.factory.create(modulePortal.moduleRef.injector);
            // componentPortal.injector = componentPortal.ref.injector;
            // componentPortal.viewRef = componentPortal.ref.hostView;


            const templateRefs = this.templatesService.templates.get(component);

            if (names.length > templateRefs.length) {
              throw new Error('The number of names must not exceed the number of templates');
            }

            for (let index = 0; index < names.length; index++) {
              const name = names[index];
              const templateRef = templateRefs[index];

              const templatePortal = new TemplatePortal();
              templatePortal.tag = name;
              templatePortal.ref = templateRef;
              templatePortal.viewRef = templatePortal.ref.createEmbeddedView(undefined);

              modulePortal.portals.set(name, templatePortal);
            }

          } else if (isComponentTypeOption(type)) {
            const { component, name } = type;
            const componentPortal = new ComponentPortal();

            componentPortal.type = component;
            componentPortal.factory = modulePortal.moduleRef.componentFactoryResolver.resolveComponentFactory(component);
            componentPortal.ref = componentPortal.factory.create(modulePortal.moduleRef.injector);

            componentPortal.injector = componentPortal.ref.injector;
            componentPortal.viewRef = componentPortal.ref.hostView;

            modulePortal.portals.set(name, componentPortal);
          }
        }

        return modulePortal;
      }),
      map((portal) => {
        for (const [_, p] of portal.portals) {

          this.viewContainer.insert(p.viewRef);
        }
      }),
    )
    .subscribe();

  constructor(
    @Inject('test') private testLoader: any,
    private config: ConfigService,
    private injector: Injector,
    private compiler: Compiler,
    private templatesService: TemplatesService,
    private viewContainer: ViewContainerRef,
    @Inject(CONSOLE) private console: Console,
  ) {}

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
