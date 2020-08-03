import { Type, NgModuleFactory } from '@angular/core';
import { Observable } from 'rxjs';

/**
 *
 * Often this function will be implemented using an ES dynamic `import()` expression. For example:
 *
 * ```
 * [{
 *   path: 'lazy',
 *   load: () => import('./lazy-route/lazy.module').then(mod => mod.LazyModule),
 * }];
 * ```
 *
 * This function _must_ match the form above: an arrow function of the form
 * `() => import('...').then(mod => mod.MODULE)`.
 *
 * @publicApi
 */
export declare type LoadCallback = () =>
  Type<any>
  | NgModuleFactory<any>
  | Observable<Type<any>>
  | Promise<NgModuleFactory<any> | Type<any> | any>;
