import { Directive, Inject, InjectionToken, Provider, TemplateRef, Type } from '@angular/core';

import { TemplatesService } from './templates.service';

// tslint:disable:no-attribute-decorator

// tslint:disable-next-line:only-arrow-functions
export function provideComponentAccessor<T extends Type<{}>>(base: T): Provider {
  return {
    provide: COMPONENT_ACCESSOR,
    useValue: base,
  };
}

const COMPONENT_ACCESSOR = new InjectionToken<Type<any>>('ComponentAccessor');

@Directive({
  selector: '[dynamicContent]'
})
export class DynamicContentDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private templatesService: TemplatesService,
    @Inject(COMPONENT_ACCESSOR) private component: Type<any>,
  ) {
    this.templatesService.set(this.component, this.templateRef);
  }
}
