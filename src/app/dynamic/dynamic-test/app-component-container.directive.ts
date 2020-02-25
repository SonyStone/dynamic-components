import { Directive, OnDestroy, ViewContainerRef, ChangeDetectorRef, SkipSelf } from '@angular/core';

import { AppComponentService } from './app-component.service';

/**
 * from:
 * https://blog.angularindepth.com/here-is-how-to-get-viewcontainerref-before-viewchild-query-is-evaluated-f649e51315fb
 */
@Directive({
  selector: '[appComponentContainer]',
})
export class AppComponentContainerDirective implements OnDestroy {

  private subscription = this.appComponentService.component$
    .subscribe((componentRef?) => {
      this.viewContainerRef.detach();

      if (componentRef) {
        this.viewContainerRef.insert(componentRef.hostView);
      }
    });

  constructor(
    @SkipSelf() private changeDetectorRef: ChangeDetectorRef,
    private viewContainerRef: ViewContainerRef,
    private appComponentService: AppComponentService,
  ) {
    console.log(`Directive changeDetectorRef`, this.changeDetectorRef);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    this.viewContainerRef.clear();
  }
}
