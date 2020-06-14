import {
  ChangeDetectionStrategy,
  Compiler,
  Component,
  ComponentFactoryResolver,
  NgModuleRef,
  ViewContainerRef,
} from '@angular/core';

import { Test1Component } from './test-1';
import { TestComponentsContext } from './test-components';
import { TestDataContext } from './test-data';

@Component({
  selector: 'app-dynamic-test',
  templateUrl: 'dynamic-test.component.html',
  styleUrls: ['dynamic-test.component.scss'],
  providers: [
    TestDataContext,
    TestComponentsContext,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTestComponent {

  tempComponent = Test1Component;

  constructor(
    public componentFactoryResolver: ComponentFactoryResolver,
    public viewContainer: ViewContainerRef,
    public compiler: Compiler,
    public moduleRef: NgModuleRef<any>,
  ) {}
}
