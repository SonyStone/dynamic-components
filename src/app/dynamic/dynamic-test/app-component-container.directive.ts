import { Directive, OnDestroy, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppComponentService } from './app-component.service';

/**
 * from:
 * https://blog.angularindepth.com/here-is-how-to-get-viewcontainerref-before-viewchild-query-is-evaluated-f649e51315fb
 */
@Directive({
  selector: '[appComponentContainer]',
})
export class AppComponentContainerDirective implements OnDestroy {

  private ngUnsubscribe: Subject<any> = new Subject();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private appComponentService: AppComponentService,
  ) {
    this.appComponentService.component$
      .pipe(
        takeUntil(this.ngUnsubscribe),
      )
      .subscribe((componentRef?) => {
        this.viewContainerRef.detach();

        if (componentRef) {
          this.viewContainerRef.insert(componentRef.hostView);
        }
      });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.viewContainerRef.clear();
  }
}
