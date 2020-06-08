import {
  Directive,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  Injectable,
} from '@angular/core';

import { AsyncLike } from './utils/strategies';
import { StrategyHandler } from './utils/strategy.handler';
import { AbstractContext, ViewContextHandler } from './view-context.service';

@Injectable({ providedIn: 'root' })
export class DataContextStore {
  constructor() {}

  get<T>(selector: string, injector: Injector): AsyncLike<AbstractContext<T>> | undefined {
    try {
      return injector.get(selector);
    } catch {
      console.warn(`injector not found for value: ${selector}`);

      return undefined;
    }
  }
}

@Directive({
  selector: '[getData]',
  providers: [
    ViewContextHandler,
    StrategyHandler,
  ],
})
export class GetDataDirective<T> implements OnChanges, OnDestroy {

  @Input() getDataFrom: string | undefined;

  private context: AbstractContext<T> | undefined;

  constructor(
    private injector: Injector,
    private data: DataContextStore,
    private viewContextHandler: ViewContextHandler<AbstractContext<T>>,
    private strategyHandler: StrategyHandler<AbstractContext<T>>,
    // private templateRef: TemplateRef<AbstractContext<T>>,
    // private viewContainer: ViewContainerRef,
  ) {}

  ngOnChanges({ getDataFrom }: SimpleChanges): void {
    if (getDataFrom && getDataFrom.currentValue !== getDataFrom.previousValue) {

      const contextAsync = this.data.get(getDataFrom.currentValue, this.injector);

      this.dispose();

      if (contextAsync) {
        this.strategyHandler.handleContext(
          contextAsync,
          (context) => {
            this.context = context;
            context.set(this.viewContextHandler)
          },
        )

      } else {
        this.viewContextHandler.clear();
      }

    }
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  private dispose(): void {
    if (this.context) {
      this.viewContextHandler.clear();
      this.context.remove(this.viewContextHandler);
    }
  }
}

