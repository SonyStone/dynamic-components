import { NgModulePortal } from './portals/ng-module';

export interface DynamicConfig<T> {
  types?: TypeOption<T>[];
}

export type LoadCallback<T> = () => Promise<T>;

export interface TypeOption<T> {
  type?: string;
  types?: string[];

  /** load module async */
  async?: LoadCallback<NgModulePortal<T>>;

  /** load module sync */
  sync?: NgModulePortal<T>;
}
