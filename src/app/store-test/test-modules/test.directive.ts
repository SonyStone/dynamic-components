import {
  AbstractType,
  ChangeDetectorRef,
  Compiler,
  ComponentFactoryResolver,
  Directive,
  Injectable,
  InjectFlags,
  InjectionToken,
  Injector,
  NgModule,
  NgModuleFactory,
  NgModuleRef,
  OnDestroy,
  TemplateRef,
  Type,
  ViewContainerRef,
} from '@angular/core';
import { DATA_MAP } from 'store';

import { TestData1Module } from './test-data-1.module';

@Injectable()
export class TestInjector implements Injector {

  injector: Injector;

  create(injector: Injector) {
    this.injector = injector;
  }

  get<T>(token: Type<T> | InjectionToken<T> | AbstractType<T>, notFoundValue?: T, flags?: InjectFlags): T;
  get(token: any, notFoundValue?: any);
  get(token: any, notFoundValue?: any, flags?: any) {
    return this.injector.get(token, notFoundValue, flags)
  }
}

@Directive({
  selector: '[appTest]',
})
export class TestDirective implements OnDestroy {

  private moduleRef: NgModuleRef<any>;

  compileNgModule = <T>(elementModuleOrFactory: NgModuleFactory<T> | Type<T>) => {
    if (elementModuleOrFactory instanceof NgModuleFactory) {
      return elementModuleOrFactory;
    } else {
      return this.compiler.compileModuleAsync(elementModuleOrFactory);
    }
  }

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private injector: Injector,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private cd: ChangeDetectorRef,
  ) {

    const selector = 'user-admin';

    data[selector]()
      .then(this.compileNgModule)
      .then((moduleFactory) => {
        console.log(`1:: moduleFactory`, moduleFactory);

        this.moduleRef = moduleFactory.create(this.injector);

        const service = (this.moduleRef.instance as any).type;
        DATA_MAP.set(selector, service);

        const component = (this.moduleRef.instance as any).component;
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);

        const viewRef = this.templateRef.createEmbeddedView({});

        console.log(`ViewContainerRef`, this.viewContainer);
        // this.viewContainer.injector = this.moduleRef.injector;

        const componentRef = this.viewContainer.createComponent(
          componentFactory,
          0,
          this.moduleRef.injector,
          [viewRef.rootNodes],
          this.moduleRef,
        )

        console.log(`this.cd`, this.cd);
        console.log(`viewRef`, viewRef);
        console.log(`componentRef.changeDetectorRef`, componentRef.changeDetectorRef);

        // const viewRef2 = this.viewContainer.createEmbeddedView(this.templateRef);

        // console.log(`viewRef2`, viewRef2);
      })

  }

  ngOnDestroy(): void {
    this.moduleRef.destroy();
  }

}


@NgModule({
  exports: [TestDirective],
  declarations: [TestDirective],
})
export class TestModule { }


const data = {
  'user-admin': () => new Promise<typeof TestData1Module>((resolve) => resolve(TestData1Module)),
  'user-admin-2': () => import('./test-data-2.module').then((m) => m.TestData2Module),
}
