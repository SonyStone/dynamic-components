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

import { ComponentData, Context } from './component-data';
import { WithComponent } from './create-component';
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

  componentData = new ComponentData<any>(this.injector);

  componentRef$ = this.selectorSubject.pipe(
    map((selector) => components[selector]),
    filter((moduleOrFactory) => !!moduleOrFactory),
    this.moduleCompiler.compile(),
    map((moduleFactory) => moduleFactory.create(this.moduleRef.injector)),
    map((moduleRef) => {
      const component = moduleRef.instance.component;
      const componentFactoryResolver = moduleRef.componentFactoryResolver;

      return this.componentData.init(component, componentFactoryResolver);
    }),
    shareReplay(),
  );

  private subscription = new Subscription()
    .add(
      this.componentRef$.subscribe((componentData) => {
        this.viewContainer.clear();
        const index = this.viewContainer.length;

        this.viewContainer.insert(componentData.componentRef.hostView, index);

        componentData.componentRef.changeDetectorRef.markForCheck();
      }),
    ).add(
      combineLatest(this.contextSubject, this.componentRef$)
        .pipe(
          filter(([context, componentData]) => !!(context && componentData)),
        ).subscribe(([context, componentData]) => {
          componentData.update(context);
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
