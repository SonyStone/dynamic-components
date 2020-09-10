import { inject, InjectionToken } from '@angular/core';
import { CONSOLE } from 'doc-viewer';

export const lib = (console: Console) => import('./lib')
  .then((p) => new p.Lib(console));

export type LazyLib = ReturnType<typeof lib>;

export const LIB = new InjectionToken<LazyLib>('lib', {
  providedIn: 'root',
  factory: () => lib(inject(CONSOLE)),
});
