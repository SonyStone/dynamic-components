import { InjectionToken } from '@angular/core';

export type StoreStorage = Map<string, any>;

export const STORE_STORAGE = new InjectionToken<StoreStorage>('store-storage', {
  providedIn: 'root',
  factory: () => new Map(),
});
