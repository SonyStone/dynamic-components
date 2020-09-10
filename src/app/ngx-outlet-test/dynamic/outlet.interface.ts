import { Injector, Type } from '@angular/core';

export interface Outlet {
  component: Type<any>;
  context?: { [key: string]: any; };
  injector?: Injector;
  content?:	any;
  dontTrackBy?: any;
}
