import { Directive, Input, ViewContainerRef, ViewRef } from '@angular/core';

import { ComponentCreaterService } from './component-creater.service';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamic-children-outlet]',
})
export class DynamicChildrenOutletDirective {

  @Input('dynamic-children-outlet') selector: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentCreaterService: ComponentCreaterService,
  ) {
    this.componentCreaterService.addChild(this);
  }

  insert(viewRef: ViewRef): void {
    this.viewContainerRef.insert(viewRef);
  }
}