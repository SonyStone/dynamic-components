import { Directive, NgModule, OnDestroy, Injectable, Injector, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class BeforeDestroyService {
  beforeDestroy = new Subject();

  constructor(
    private injector: Injector,
    private viewContainer: ViewContainerRef,
  ) {
    // console.log(viewContainer);
  }
}

@Directive({
  selector: '[beforeDestroy]',
})
export class BeforeDestroyDirective implements OnDestroy {
  constructor(
    private beforeDestroyService: BeforeDestroyService,
  ) {}

  ngOnDestroy(): void {
    this.beforeDestroyService.beforeDestroy.next();
    // console.log(`beforeDestroy OnDestroy`);
  }
}

@NgModule({
  declarations: [BeforeDestroyDirective],
  exports: [BeforeDestroyDirective],
})
export class BeforeDestroyModule { }
