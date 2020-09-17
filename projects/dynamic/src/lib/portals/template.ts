import { EmbeddedViewRef, NgModuleRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { ComponentPortal } from './component';
import { TemplatesService } from '../templates.service';

export class TemplatePortal<T> {
  hostComponent: ComponentPortal<any>;
  moduleRef: NgModuleRef<any>;
  tag: string;
  ref: TemplateRef<T>;
  viewRef: EmbeddedViewRef<T>;
  selectors: string[];

  templatePortals: TemplatePortal<T>[] = [];

  create(): Promise<this> {
    const componentPortal = this.hostComponent;
    const injector = this.moduleRef.injector;

    componentPortal.moduleRef = this.moduleRef;

    componentPortal.createFactory();

    componentPortal.createComponent();

    const templatesService = injector.get(TemplatesService);

    const templateRefs = templatesService.templates.get(componentPortal.type);
    const names = this.selectors;

    if (names.length > templateRefs.length) {
      throw new Error('The number of names must not exceed the number of templates');
    }

    for (let index = 0; index < names.length; index++) {
      const name = names[index];
      const templateRef = templateRefs[index];

      const templatePortal = new TemplatePortal<T>();
      templatePortal.tag = name;
      templatePortal.ref = templateRef;
      // templatePortal.viewRef = templatePortal.ref.createEmbeddedView(undefined);

      this.templatePortals.push(templatePortal);
    }

    return new Promise((resolve) => resolve(this));
  }

  attach(viewContainer: ViewContainerRef, index?: number): void {
    const ref = this.ref;

    for (const templatePortal of this.templatePortals) {
      const viewRef = viewContainer.createEmbeddedView(templatePortal.ref, {});
      viewRef.markForCheck();
    }
  }
}
