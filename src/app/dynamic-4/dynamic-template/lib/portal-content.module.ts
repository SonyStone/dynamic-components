import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { DynamicOption } from '@factory/utils';

import { ConfigService } from './config.service';
import { DYNAMIC_CONFIG, DynamicConfig } from './dynamic-config';
import { PortalContentDirective } from './portal-content.directive';



@NgModule({
  declarations: [
    PortalContentDirective,
  ],
  exports: [
    PortalContentDirective,
  ],
})
export class PortalContentModule {
  static forChild(config: DynamicConfig = {}): ModuleWithProviders<PortalContentModule> {
    return {
      ngModule: PortalContentModule,
      providers: [
        { provide: DYNAMIC_CONFIG, useValue: config },
      ],
    };
  }

  constructor(
    configService: ConfigService,
    @Optional() @Inject(DYNAMIC_CONFIG) config: DynamicOption,
  ) {
    if (config) {
      configService.addConfig(config)
    }
  }
}
