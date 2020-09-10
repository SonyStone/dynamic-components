import { InjectionToken } from '@angular/core';

import { DynamicConfig, LoadCallback } from './dynamic-config.interface';
import { NgModulePortal } from './portals/ng-module';

export const DYNAMIC_CONFIG = new InjectionToken<DynamicConfig<NgModulePortal<any>>>('dynamic_config');

export const DYNAMIC_TYPES_MAP = new InjectionToken<Map<string, NgModulePortal<any>>>('dynamic_types_map');

export const DYNAMIC_LAZY_TYPES_MAP = new InjectionToken<Map<string, LoadCallback<NgModulePortal<any>>>>('dynamic_lazy_types_map');
