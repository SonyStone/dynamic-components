import { inject, InjectionToken, Injector, Type, TypeDecorator } from '@angular/core';
import { of, OperatorFunction, pipe } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AbstractContext } from './abstract.context';
import { AsyncLike } from './utils/switch-to-observable';

export const dataMap = new Map<string, Type<any>|InjectionToken<any>>();

export function Data(options: { selector: string }): TypeDecorator {
  return (type: Type<any>) => {

    const { selector } = options;
    dataMap.set(selector, type);

    return type;
  }
}

export const DATA_MAP =
  new InjectionToken<Map<string, Type<any>|InjectionToken<any>>>('data map', {
    providedIn: 'root',
    factory: () => dataMap,
  });

export type DataInjectorGetter<C> = (injector: Injector) => OperatorFunction<string, AsyncLike<AbstractContext<C>>>;

export const DATA_INJECTOR =
  new InjectionToken<DataInjectorGetter<any>>('data injector', {
    providedIn: 'root',
    factory: () => {

      const data = inject(DATA_MAP)

      return (injector: Injector) => pipe(
        map((selector: string) => data.get(selector)),
        map((token) => token && injector.get(token)),
        catchError(() => of(undefined)),
      )
    }
  });
