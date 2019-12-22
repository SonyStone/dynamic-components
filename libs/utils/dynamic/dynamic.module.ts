import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { ComponentOutletModule } from '../component-outlet';
import { ComponentPipe } from './component.pipe';
import { DynamicComponent } from './dynamic.component';
import { DYNAMIC_CONFIG, DynamicConfig, DynamicOption } from './dynamic.config';



@NgModule({
  imports: [
    ComponentOutletModule,
  ],
  declarations: [
    ComponentPipe,
    DynamicComponent,
  ],
  exports: [
    DynamicComponent,
  ],
})
export class DynamicModule {
  static forRoot(config: DynamicOption = {}): ModuleWithProviders {
    return {
      ngModule: DynamicModule,
    };
  }

  static forChild(config: DynamicOption = {}): ModuleWithProviders {
    return {
      ngModule: DynamicModule,
      providers: [
        { provide: DYNAMIC_CONFIG, useValue: config, multi: true },
      ],
    };
  }

  constructor(
    configService: DynamicConfig,
    @Optional() @Inject(DYNAMIC_CONFIG) configs: DynamicOption[] = [],
  ) {
    if (!configs) {
      return;
    }

    configs.forEach(config => configService.addConfig(config));
  }
}
