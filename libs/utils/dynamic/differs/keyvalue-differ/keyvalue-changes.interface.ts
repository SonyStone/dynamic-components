import { KeyValueChangeRecord } from './keyvalue-change-record.interface';

/**
 * An object describing the changes in the `Map` or `{[k:string]: string}` since last time
 * `KeyValueDiffer#diff()` was invoked.
 *
 * @publicApi
 */
export interface KeyValueChanges<K, V> {
  /**
   * Iterate over all changes. `KeyValueChangeRecord` will contain information about changes
   * to each item.
   */
  forEachItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over changes in the order of original Map showing where the original items
   * have moved.
   */
  forEachPreviousItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all keys for which values have changed.
   */
  forEachChangedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all added items.
   */
  forEachAddedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;

  /**
   * Iterate over all removed items.
   */
  forEachRemovedItem(fn: (r: KeyValueChangeRecord<K, V>) => void): void;
}