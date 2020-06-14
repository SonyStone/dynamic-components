import {
  Directive,
  Injector,
  Input,
  NgModule,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { filter, map, shareReplay } from 'rxjs/operators';

import { WithComponent } from './create-component';
import { Context } from './dynamic-component-factory/context.interface';
import { DynamicComponentBindings } from './dynamic-component-factory/dynamic-component-factory';
import { ModuleCompiler } from './module-compiler';

export const components = {
  'test-1': () => import('./test-1').then((m) => m.Test1Module),
  'test-2': () => import('./test-2').then((m) => m.Test2Module),
  'test-3': () => import('./test-3').then((m) => m.Test3Module),
  'test-4': () => import('./test-4').then((m) => m.Test4Module),
  'test-5': () => import('./test-5').then((m) => m.Test5Module),
}

@Directive({
  selector: '[dynamic]',
})
export class DynamicDirective implements OnChanges, OnDestroy {

  @Input('dynamic') selector: string | undefined;
  private selectorSubject = new Subject<string>();

  @Input('dynamicContext') context: Context | undefined;
  private contextSubject = new Subject<Context>();

  private dynamicComponentBindings = new DynamicComponentBindings<any>();

  componentRef$ = this.selectorSubject.pipe(
    map((selector) => components[selector]),
    filter((moduleOrFactory) => !!moduleOrFactory),
    this.moduleCompiler.compile(),
    map((moduleFactory) => moduleFactory.create(this.moduleRef.injector)),
    map((moduleRef) => moduleRef.componentFactoryResolver.resolveComponentFactory(moduleRef.instance.component)),
    map((componentFactory) => this.dynamicComponentBindings.set(componentFactory, this.injector)),
    shareReplay(),
  );

  private subscription = new Subscription()
    .add(
      this.componentRef$
        .subscribe((dynamicComponentBindings) => {
          this.viewContainer.clear();
          const index = this.viewContainer.length;

          this.viewContainer.insert(dynamicComponentBindings.componentRef.hostView, index);

          dynamicComponentBindings.changeDetectorRef.markForCheck();
        }),
    ).add(
      combineLatest(this.contextSubject, this.componentRef$)
        .pipe(
          filter(([context, dynamicComponentBindings]) => !!(context && dynamicComponentBindings)),
        )
        .subscribe(([context, dynamicComponentBindings]) => {
          dynamicComponentBindings.update(context);
        }),
    )

  constructor(
    private injector: Injector,
    private moduleRef: NgModuleRef<WithComponent<any>>,
    private viewContainer: ViewContainerRef,
    private moduleCompiler: ModuleCompiler<WithComponent<any>>,
  ) {}

  ngOnChanges({ selector, context }: SimpleChanges): void {
    if (selector && selector.currentValue !== selector.previousValue) {

      this.selectorSubject.next(this.selector);
    }

    if (context) {
      this.contextSubject.next(this.context);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

@NgModule({
  exports: [DynamicDirective],
  declarations: [DynamicDirective],
})
export class DynamicModule { }
