import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Inject,
  Injector,
  Input,
  Output,
  TemplateRef,
  Type,
} from '@angular/core';

import { Outlet } from './outlet.interface';


export type Content<T> = string | TemplateRef<T> | Type<T>;

@Component({
  selector: 'app-component-outlet',
  template: `

    <ng-container *ngFor="let config of configs; trackBy: trackByFn">
      <ng-container *ngxComponentOutlet="config.component;
                                         context: config.context;
                                         injector: config.injector;
                                         content: resolveNgContents(config.content);"
                                         ></ng-container>
    </ng-container>

  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentOutletComponent {
  @Input() configs: Outlet[];

  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  trackByFn(index, config: Outlet): any {
    if (config.dontTrackBy) {
      return;
    }
    return config.component;
  }

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,
  ) { }

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

