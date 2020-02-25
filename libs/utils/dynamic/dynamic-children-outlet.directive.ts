import { Directive, Input, ViewContainerRef, ViewRef } from '@angular/core';

import { DynamicOutletDirective } from './dynamic-outlet.directive';

@Directive({
  selector: '[dynamic-children-outlet]',
})
export class DynamicChildrenOutletDirective {

  @Input('dynamic-children-outlet') selector: string;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dynamicOutletDirective: DynamicOutletDirective,
  ) {
    this.dynamicOutletDirective.addChild(this);
  }

  insert(viewRef: ViewRef): void {
    this.viewContainerRef.insert(viewRef);
  }
}