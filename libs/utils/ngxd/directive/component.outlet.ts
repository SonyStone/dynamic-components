import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  Directive,
  EmbeddedViewRef,
  EventEmitter,
  Injector,
  Input,
  NgModuleFactory,
  NgModuleRef,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  Type,
  ViewContainerRef,
} from '@angular/core';

import { NgxComponentOutletAdapterRef } from '../adapter/adapter-ref';
import { NgxComponentOutletAdapterBuilder } from '../adapter/adapter.builder';

// tslint:disable:no-input-rename
// tslint:disable:no-output-rename
// tslint:disable:directive-selector

@Directive({
  selector: '[ngxComponentOutletInjector]',
})
export class NgxComponentOutletInjectorDirective implements OnChanges {

  @Input('ngxComponentOutletInjector') injector: Injector;

  constructor(
    private ngxComponentOutletDirective: NgxComponentOutletDirective,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('injector' in changes) {
      this.ngxComponentOutletDirective.injector = this.injector;
    }
  }
}

@Directive({
  selector: '[ngxComponentOutlet]',
})
export class NgxComponentOutletDirective implements OnChanges, OnDestroy {
  @Input('ngxComponentOutlet') outlet: Type<any>;
  @Input('ngxComponentOutletContent') content: any[][];
  @Input('ngxComponentOutletContext') context: any;
  @Input('ngxComponentOutletNgModuleFactory') ngModuleFactory: NgModuleFactory<any>;

  @Output('ngxComponentOutletActivate') activate = new EventEmitter<any>();
  @Output('ngxComponentOutletDeactivate') deactivate = new EventEmitter<any>();

  private adapterRef: NgxComponentOutletAdapterRef<any>;
  private ngModuleRef: NgModuleRef<any>;

  private get componentFactoryResolver(): ComponentFactoryResolver {
    return this.ngModuleRef
      ? this.ngModuleRef.componentFactoryResolver
      : this._componentFactoryResolver;
  }

  injector: Injector = this.viewContainerRef.injector;

  cached: any;

  private get host(): any {
    if (this.cached) {
      return this.cached;
    }

    const { context } = this.changeDetectorRef as EmbeddedViewRef<any>;

    return (this.cached = context);
  }

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    private changeDetectorRef: ChangeDetectorRef,
    private builder: NgxComponentOutletAdapterBuilder
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.outlet) {
      if (changes.ngModuleFactory) {
        this.destroyNgModuleRef();
        this.createNgModuleRef();
      }

      this.destroyAdapterRef();
      this.createAdapterRef();
    }

    if (changes.context) {
      this.applyContext();
    }
  }

  private applyContext() {
    if (this.adapterRef) {
      this.adapterRef.updateContext(this.context);
    }
  }

  ngOnDestroy() {
    this.destroyAdapterRef();
    this.destroyNgModuleRef();
  }

  private createAdapterRef() {
    if (this.outlet) {
      this.adapterRef = this.builder.create(
        this.outlet,
        this.viewContainerRef,
        this.injector,
        this.content,
        this.host,
        this.componentFactoryResolver
      );
      if (this.context) {
        this.applyContext();
      }
      this.activate.emit(this.adapterRef.componentRef.instance);
    }
  }

  private destroyAdapterRef() {
    if (this.adapterRef) {
      this.deactivate.emit(this.adapterRef.componentRef.instance);
      this.adapterRef.dispose();
      this.adapterRef = null;
    }
  }

  private createNgModuleRef() {
    if (this.ngModuleFactory) {
      this.ngModuleRef = this.ngModuleFactory.create(this.injector);
    }
  }

  private destroyNgModuleRef() {
    if (this.ngModuleRef) {
      this.ngModuleRef.destroy();
      this.ngModuleRef = null;
    }
  }
}
