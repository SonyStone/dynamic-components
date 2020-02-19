import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injector, TemplateRef, Type } from '@angular/core';

export type Content<T> = string | TemplateRef<T> | Type<T>;

export class NgContentResolver {

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
  ) {  }

  resolveNgContents<T>(content: Content<T>[][]) {
    if (Array.isArray(content)) {

      return content.map((elements) => elements.map((element) => this.resolveNgContent(element)));
    }
  }

  resolveNgContent<T>(content: Content<T>) {
    if (!content) { return; }

    if (typeof content === 'string') {
      const element = this.htmlToElement(content);

      return element;
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(null);

      return [viewRef.rootNodes];
    }

    const factory = this.resolver.resolveComponentFactory(content);
    const componentRef = factory.create(this.injector);

    return componentRef.location.nativeElement;
  }

  private htmlToElement(html) {
    const template = this.document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  }
}

