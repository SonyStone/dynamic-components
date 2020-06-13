import { ComponentFactory, ComponentFactoryResolver } from '@angular/core';
import { Subscription } from 'rxjs';

export function componentAdapter<C>(
  componentFactoryResolver: ComponentFactoryResolver,
  componentFactory: ComponentFactory<C>
): void {
  // console.log(
  //   componentFactoryResolver,
  //   componentFactory
  // )

  // ComponentDef

  // componentFactory
  // componentFactory.
}

// export class ComponentAdapter {

//   private attachedInputs: Subscription[] = [];
//   private attachedOutputs: Subscription[] = [];

//   constructor(
//     private componentFactory: ComponentFactory<C>,
//   ) {

//     this.componentFactory.inputs
//   }
// }