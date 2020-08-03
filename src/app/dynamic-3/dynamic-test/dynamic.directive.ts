import {
  ComponentFactoryResolver,
  Directive,
  Injector,
  Input,
  NgModule,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { Context, DynamicComponentBindings } from 'dynamic';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { filter, map, shareReplay, tap } from 'rxjs/operators';

@Directive({
  selector: '[dynamic]',
})
export class DynamicDirective<C> implements OnChanges, OnDestroy {

  @Input('dynamic') component: Type<C> | undefined;
  private selectorSubject = new Subject<Type<C>>();

  @Input('dynamicContext') context: Context | undefined;
  private contextSubject = new Subject<Context>();

  private dynamicComponentBindings = new DynamicComponentBindings<any>();

  componentRef$ = this.selectorSubject.pipe(
    map((component) => this.componentFactoryResolver.resolveComponentFactory(component)),
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
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnChanges({ component, context }: SimpleChanges): void {
    if (component && component.currentValue !== component.previousValue) {

      this.selectorSubject.next(this.component);
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
