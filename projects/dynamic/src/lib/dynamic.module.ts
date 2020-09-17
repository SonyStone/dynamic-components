import { Inject, ModuleWithProviders, NgModule, Optional } from '@angular/core';

import { DynamicConfig, LoadCallback, TypeOption } from './dynamic-config.interface';
import { DynamicDirective } from './dynamic.directive';
import { DYNAMIC_CONFIG, DYNAMIC_LAZY_TYPES_MAP, DYNAMIC_TYPES_MAP } from './dynamic.injection-tolens';
import { DynamicContentDirective } from './portal-content.directive';
import { NgModulePortal } from './portals/ng-module';


@NgModule({
  declarations: [
    DynamicDirective,
    DynamicContentDirective
  ],
  exports: [
    DynamicDirective,
    DynamicContentDirective,
  ],
})
export class DynamicModule {
  static with<M>(config: DynamicConfig<M> = {}): ModuleWithProviders<DynamicModule> {

    console.log(`with`, config);

    return {
      ngModule: DynamicModule,
      providers: [
        { provide: DYNAMIC_TYPES_MAP, useValue: new Map() },
        { provide: DYNAMIC_LAZY_TYPES_MAP, useValue: new Map() },
        { provide: DYNAMIC_CONFIG, useValue: config, multi: true },
      ],
    };
  }

  static forChild(): ModuleWithProviders<DynamicModule> {
    return {
      ngModule: DynamicModule,
    };
  }

  constructor(
    @Optional() @Inject(DYNAMIC_TYPES_MAP) private map: Map<string, NgModulePortal<any>>,
    @Optional() @Inject(DYNAMIC_LAZY_TYPES_MAP) private lazyMap: Map<string, LoadCallback<NgModulePortal<any>>>,
    @Optional() @Inject(DYNAMIC_CONFIG) configs: DynamicConfig<NgModulePortal<any>>[],
  ) {
    if (configs && map) {
      for (const config of configs) {
        for (const typeOption of config?.types) {
          if (typeOption.type) {
            this.set(typeOption.type, typeOption);
          }
          if (typeOption.types) {
            for (const type of typeOption.types) {
              this.set(type, typeOption);
            }
          }
        }
      }
    }
  }

  set<T>(type: string, typeOption: TypeOption<T>): void {
    if (typeOption.sync) {
      this.map.set(type, typeOption.sync);
    } else if (typeOption.async) {
      this.lazyMap.set(type, typeOption.async);
    }
  }
}
