import { Injector } from '@angular/core';

export interface OuteltConfig {
  type: string;
  injector?: Injector;
  content?:	any;
  dontTrackBy?: any;
  [key: string]: any;
}
