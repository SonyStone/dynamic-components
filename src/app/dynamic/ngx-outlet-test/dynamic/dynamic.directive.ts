import { Directive, EmbeddedViewRef, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { DynamicConfig } from './dynamic.config';
import { OuteltConfig } from './outlet-config.interface';
import { Outlet } from './outlet.interface';

interface DynamicContext {
  $implicit: Outlet[];
  context: any[];
}

@Directive({
  selector: '[dynamic]',
})
export class DynamicDirective implements OnDestroy {

  @Input() set dynamic(value: OuteltConfig[]) {
    this.setValue(value);
  }

  @Input() dynamicContext: any[];

  private context: DynamicContext = {
    $implicit: null,
    context: null,
  };

  private viewRef: EmbeddedViewRef<DynamicContext> =
    this.viewContainer.createEmbeddedView(this.templateRef, this.context);

  constructor(
    private templateRef: TemplateRef<null>,
    private viewContainer: ViewContainerRef,
    private configService: DynamicConfig,
  ) {}

  ngOnDestroy() {
    this.viewContainer.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = null;
    }
  }

  private setValue(configs: OuteltConfig[]): void {
    if (!configs ||  configs.length === 0) { return; }

    this.context.$implicit = configs.map((config) =>
      ({
        component: this.configService.getType(config.type).component,
        context: {
          ...config,
          // ...(this.parent && this.parent.context),
          ...this.dynamicContext,
        },
        injector: config.injector,
        content: config.content,
        dontTrackBy: config.dontTrackBy,
      })
    );
  }
}
