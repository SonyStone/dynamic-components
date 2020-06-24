import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { CustomElementLoader } from './custom-element-loader';
import { CustomElementConfigs, ELEMENT_MODULE_LOAD } from './custom-element-registry';

@NgModule()
export class CustomElementModule {

  static forChild(config: CustomElementConfigs = []): ModuleWithProviders<CustomElementModule> {
    return {
      ngModule: CustomElementModule,
      providers: [
        { provide: ELEMENT_MODULE_LOAD, useValue: config, multi: true },
      ]
    }
  }

  constructor(
    loader: CustomElementLoader,
    @Optional() @Inject(ELEMENT_MODULE_LOAD) configsList: CustomElementConfigs[] = [],
  ) {
    if (!configsList) { return; }

    for (const configs of configsList) {
      for (const config of configs) {
        loader.addConfig(config);
      }
    }
  }
}
