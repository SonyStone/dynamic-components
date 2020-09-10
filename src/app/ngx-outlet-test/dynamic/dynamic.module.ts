import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional } from '@angular/core';
import { NgxdModule } from '@ngxd/core';

import { DynamicComponent } from './dynamic.component';
import { DYNAMIC_CONFIG, DynamicConfig, DynamicOption } from './dynamic.config';
import { DynamicDirective } from './dynamic.directive';
import { Layouts } from './layout.interface';

@NgModule({
  imports: [
    [
      CommonModule,
    ],
    [
      NgxdModule,
    ],
  ],
  declarations: [
    [
      DynamicDirective,
      DynamicComponent,
    ],
  ],
  exports: [
    [
      DynamicDirective,
      DynamicComponent,
    ],
  ],
})
export class NgxdDynamicModule {

  static forRoot(layouts?: Layouts, config: DynamicOption = {}): ModuleWithProviders<NgxdDynamicModule> {
    return {
      ngModule: NgxdDynamicModule,
      providers: [

      ],
    };
  }

  static forChild(config: DynamicOption = {}): ModuleWithProviders<NgxdDynamicModule> {
    return {
      ngModule: NgxdDynamicModule,
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

export const ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken<any>('AnalyzeForEntryComponents');
export const DYNAMICS = new InjectionToken<any[][]>('ROUTES');

export function provideRoutes(routes: any): any {
  return [
    {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},
    {provide: DYNAMICS, multi: true, useValue: routes},
  ];
}
