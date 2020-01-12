import { ChangeDetectionStrategy, Compiler, Component, NgModuleFactory, OnDestroy, ViewContainerRef } from '@angular/core';

import { loadTest1 } from './load-test-1';
import { ComponentRefMapService } from './view-ref-map.service';




@Component({
  templateUrl: 'lazy-load-test.component.html',
  styleUrls: ['lazy-load-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadTestComponent  {

  constructor(
    private compiler: Compiler,
    private viewContainerRef: ViewContainerRef,
    private componentRefMapService: ComponentRefMapService,
  ) {}

  load() {

    loadTest1.qwerty()
      .then((m) => (m instanceof NgModuleFactory)
        ? m
        : this.compiler.compileModuleAsync(m)
      ).then((tempModule) => {
        const componentRef = this.componentRefMapService.get(tempModule);

        this.viewContainerRef.insert(componentRef.hostView);
      });

  }

  close(): void {
    this.viewContainerRef.detach();
  }
}
