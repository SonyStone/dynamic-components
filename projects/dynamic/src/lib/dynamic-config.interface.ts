import { NgModulePortal } from './portals/ng-module';

export interface DynamicConfig<T> {
  types?: TypeOption<T>[];
}

export type LoadCallback<T> = () => Promise<T>;

export interface TypeOption<T> {
  type?: string;
  types?: string[];
  loadModule?: LoadCallback<NgModulePortal<T>>;
  module?: NgModulePortal<T>;
}
