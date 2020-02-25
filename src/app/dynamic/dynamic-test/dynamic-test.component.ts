import {
  ChangeDetectionStrategy,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnDestroy,
  OnInit,
  ViewContainerRef,
} from '@angular/core';

import { Test1Component } from './test-1.component';
import { Test2Component } from './test-2.component';
import { Test3Component } from './test-3.component';

const components = [
  Test1Component,
  Test2Component,
  // Test2Component,
  Test3Component,
  // Test3Component,
  // Test2Component,
  // Test3Component,
  // Test1Component,
  // Test2Component,
  // Test2Component,
  // Test3Component,
  // Test3Component,
  // Test2Component,
  // Test3Component,
];

@Component({
  selector: 'app-dynamic-test',
  templateUrl: 'dynamic-test.component.html',
  styleUrls: ['dynamic-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTestComponent implements OnInit, OnDestroy {
  componentRefs: Array<ComponentRef<any>>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
  ) {
    this.sectionsLoader(this.viewContainerRef);
  }

  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.componentRefs.forEach((componentRef) => {
      componentRef.destroy();
      componentRef = undefined;
    });
  }

  sectionsLoader(viewContainerRef: ViewContainerRef): void {
    const injector = this.viewContainerRef.parentInjector;



    const componentsReduser = (accumulator: Array<ComponentRef<Test1Component>>, component: typeof Test1Component, index: number) => {

      const componentRef = (accumulator.length === 0)
        ? viewContainerRef.createComponent(
            this.componentFactoryResolver.resolveComponentFactory(component),
            0,
            injector,
            [[testNode()]],
          )
        : this.componentFactoryResolver
            .resolveComponentFactory(component)
            .create(injector);

      if (accumulator.length !== 0) {
        accumulator[index - 1].instance.appComponentService.addComponent(componentRef);
        console.log(`changeDetectorRef`, accumulator[index - 1])
      }

      accumulator.push(componentRef);

      return accumulator;
    };

    this.componentRefs = components.reduce(componentsReduser as any, []);
  }

  toggle(): void {
    const current = this.componentRefs
      .find((componentRef) => this.viewContainerRef.indexOf(componentRef.hostView) !== -1);

    const currentIndex = this.componentRefs.indexOf(current);

    const length = this.componentRefs.length;

    const nextIndex = (currentIndex + 1) % length;
    const lastIndex = ((currentIndex - 1) % length === -1)
      ? length - 1
      : (currentIndex - 1) % length;

    const next = this.componentRefs[nextIndex];
    const last = this.componentRefs[lastIndex];

    current.instance.appComponentService.addComponent();
    this.viewContainerRef.detach();
    this.viewContainerRef.insert(next.hostView);
    last.instance.appComponentService.addComponent(current);
  }
}

const testNode = () => {
  const myNode = document.createElement('div');
  const text = document.createTextNode('this is my text');
  myNode.appendChild(text);

  return myNode;
};
