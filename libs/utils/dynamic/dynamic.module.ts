import { CommonModule } from '@angular/common';
import { Inject, InjectionToken, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { NgxdModule } from '../ngxd';
import { DynamicChildrenOutletDirective } from './dynamic-children-outlet.directive';
import { DynamicOutletDirective } from './dynamic-outlet.directive';
import { DYNAMIC_CONFIG, DynamicConfig, DynamicOption } from './dynamic.config';
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
      DynamicOutletDirective,
      DynamicChildrenOutletDirective,
    ],
  ],
  exports: [
    [
      DynamicOutletDirective,
      DynamicChildrenOutletDirective,
    ],
  ],
})
export class DynamicModule {

  static forRoot(layouts?: Layouts, config: DynamicOption = {}): ModuleWithProviders<DynamicModule> {
    return {
      ngModule: DynamicModule,
      providers: [

      ],
    };
  }

  static forChild(config: DynamicOption = {}): ModuleWithProviders<DynamicModule> {
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

export const ANALYZE_FOR_ENTRY_COMPONENTS = new InjectionToken<any>('AnalyzeForEntryComponents');
export const DYNAMICS = new InjectionToken<any[][]>('ROUTES');

export function provideRoutes(routes: any): any {
  return [
    {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routes},
    {provide: DYNAMICS, multi: true, useValue: routes},
  ];
}
