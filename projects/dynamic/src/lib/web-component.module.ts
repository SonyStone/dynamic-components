import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { ELEMENT_MODULE_LOAD, WebComponentConfigs } from './element-registry';
import { WebComponentLoader } from './web-component-loader';

@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [],
})
export class WebComponentModule {

  static forChild(config: WebComponentConfigs = []): ModuleWithProviders<WebComponentModule> {
    return {
      ngModule: WebComponentModule,
      providers: [
        { provide: ELEMENT_MODULE_LOAD, useValue: config, multi: true },
      ]
    }
  }

  constructor(
    loader: WebComponentLoader,
    @Optional() @Inject(ELEMENT_MODULE_LOAD) configsList: WebComponentConfigs[] = [],
  ) {
    if (!configsList) { return; }

    for (const configs of configsList) {
      for (const config of configs) {
        loader.addConfig(config);
      }
    }
  }
}
