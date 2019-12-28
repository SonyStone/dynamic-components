import { NgModuleFactory, Type } from '@angular/core';
import { Observable } from 'rxjs';

export type LoadChildren = () =>
  Type<any> |
  NgModuleFactory<any> |
  Observable<Type<any>> |
  Promise<
    NgModuleFactory<any> |
    Type<any> |
    any
  >;
