import { Injectable, NgModuleRef, OnDestroy, Type } from '@angular/core';
import { Compiler, functionUnpacking } from 'dynamic';
import { BehaviorSubject, of, timer } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';
import { AbstractContext, Data, switchToObservable } from 'store';

import { WithComponent } from './create-component';

// tslint:disable:member-ordering

const testComponents = [
  'test-1',
  'test-2',
  'test-3',
  'test-4',
  'test-5',
]

export const components = [
  () => import('./test-1').then((m) => m.Test1Module),
  () => import('./test-2').then((m) => m.Test2Module),
  () => import('./test-3').then((m) => m.Test3Module),
  () => import('./test-4').then((m) => m.Test4Module),
  () => import('./test-5').then((m) => m.Test5Module),
]


@Injectable()
@Data({ selector: 'test-components' })
export class TestComponentsContext implements AbstractContext<TestComponentsContext>, OnDestroy {

  type = 3;

  $implicit: Type<any>;

  action$ = new BehaviorSubject<() => Promise<Type<any>>>(components[this.type])

  private modules = new Map<any, NgModuleRef<any>>()

  context$ = this.action$.pipe(
    switchMap((path) => (this.modules.has(path))
      ? of(this.modules.get(path))
      : of(path)
        .pipe(
          functionUnpacking(),
          switchToObservable(),
          this.compiler.compileModuleAsync,
          map((moduleFactory) => moduleFactory.create(this.moduleRef.injector)),
          tap((moduleRef) => this.modules.set(path, moduleRef)),
        )
    ),
    map((moduleRef) => moduleRef.instance.component),
    tap((component) => {
      this.$implicit = component;
    }),
    mapTo(this),
  )

  private subscription = timer(2000, 2000)
    .subscribe(() => this.next());

  next = () => {
    this.type++;
    this.type = (this.type !== components.length) ? this.type : 0;

    this.action$.next(components[this.type]);
  };

  constructor(
    private compiler: Compiler<WithComponent<any>>,
    private moduleRef: NgModuleRef<WithComponent<any>>,
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();

    this.modules.forEach((module) => module.destroy());
  }
}

