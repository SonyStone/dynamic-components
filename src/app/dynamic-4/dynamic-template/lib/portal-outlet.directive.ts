import {
  Compiler,
  ComponentFactory,
  ComponentRef,
  Directive,
  EmbeddedViewRef,
  Inject,
  Injector,
  NgModuleRef,
  TemplateRef,
  Type,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { NgModuleFactory } from '@angular/core/src/r3_symbols';
import { CONSOLE } from 'doc-viewer';
import { from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Test1Module } from '../test-1/test-1.module';
import { ConfigService } from './config.service';
import { ComponentTypeOption, TemplateTypeOption } from './dynamic-config';
import { TemplatesService } from './templates.service';

class NgModulePortal<M> {
  module: Type<M>;
  moduleFactory: NgModuleFactory<M>;
  moduleRef: NgModuleRef<M>;
  injector: Injector;

  components: Map<string, ComponentPortal<any>> = new Map();

  templates: Map<string, TemplatePortal<any>> = new Map();

  portals: Map<string, TemplatePortal<any> | ComponentPortal<any>> = new Map();
}

class TemplatePortal<T> {
  tag: string;
  ref: TemplateRef<T>;
  viewRef: EmbeddedViewRef<T>;
}

class ComponentPortal<C> {
  type: Type<C>;
  factory: ComponentFactory<C>;
  ref: ComponentRef<C>;
  injector: Injector;
  viewRef: ViewRef;
}

const isTemplateTypeOption = (type: TemplateTypeOption | ComponentTypeOption): type is TemplateTypeOption =>
  !!(type as TemplateTypeOption)?.names;

const isComponentTypeOption = (type: TemplateTypeOption | ComponentTypeOption): type is ComponentTypeOption =>
  !!((type as ComponentTypeOption)?.name);

@Directive({
  selector: '[portalOutlet]',
})
export class PortalOutletDirective {

  sub = of(Test1Module)
    .pipe(
      map((module) => {
        const portal = new NgModulePortal<Test1Module>();
        portal.module = module;
        portal.injector = this.injector;

        return portal;
      }),
      switchMap((portal) => from(this.compiler.compileModuleAsync(portal.module))
        .pipe(
          map((moduleFactory) => {
            portal.moduleFactory = moduleFactory;

            return portal;
          }),
        ),
      ),
      map((portal) => {
        portal.moduleRef = portal.moduleFactory.create(portal.injector);

        return portal;
      }),
      map((portal) => {

        this.console.log(`this.`, this.config.config);

        for (const type of this.config.config.types) {
          if (isTemplateTypeOption(type)) {
            const { component, names } = type

            const componentPortal = new ComponentPortal();

            componentPortal.type = component;
            componentPortal.factory = portal.moduleRef.componentFactoryResolver.resolveComponentFactory(component);
            componentPortal.ref = componentPortal.factory.create(portal.moduleRef.injector);
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

              portal.portals.set(name, templatePortal);
            }

          } else if (isComponentTypeOption(type)) {
            const { component, name } = type;
            const componentPortal = new ComponentPortal();

            componentPortal.type = component;
            componentPortal.factory = portal.moduleRef.componentFactoryResolver.resolveComponentFactory(component);
            componentPortal.ref = componentPortal.factory.create(portal.moduleRef.injector);

            componentPortal.injector = componentPortal.ref.injector;
            componentPortal.viewRef = componentPortal.ref.hostView;

            portal.portals.set(name, componentPortal);
          }
        }

        return portal;
      }),
      map((portal) => {
        for (const [_, p] of portal.portals) {

          this.viewContainer.insert(p.viewRef);
        }
      }),
    )
    .subscribe();

  constructor(
    private config: ConfigService,
    private injector: Injector,
    private compiler: Compiler,
    private templatesService: TemplatesService,
    private viewContainer: ViewContainerRef,
    @Inject(CONSOLE) private console: Console,
  ) {}
}
