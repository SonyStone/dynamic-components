import { InjectionToken } from '@angular/core';

export interface DynamicConfig {
  types?: (TemplateTypeOption | ComponentTypeOption)[];
}

export interface TemplateTypeOption {
  names: string[];
  component?: any;
  wrappers?: string[];
  extends?: string;
}

export interface ComponentTypeOption {
  name: string;
  component?: any;
  wrappers?: string[];
  extends?: string;
}

export const DYNAMIC_CONFIG = new InjectionToken<DynamicConfig>('dynamicConfig');
