import { IterableChangeRecord } from './iterable-change-record.interface';

/**
 * An object describing the changes in the `Iterable` collection since last time
 * `IterableDiffer#diff()` was invoked.
 *
 * @publicApi
 */
export interface IterableChanges<V> {
  /**
   * Iterate over all changes. `IterableChangeRecord` will contain information about changes
   * to each item.
   */
  forEachItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /**
   * Iterate over a set of operations which when applied to the original `Iterable` will produce the
   * new `Iterable`.
   *
   * NOTE: These are not necessarily the actual operations which were applied to the original
   * `Iterable`, rather these are a set of computed operations which may not be the same as the
   * ones applied.
   *
   * @param record A change which needs to be applied
   * @param previousIndex The `IterableChangeRecord#previousIndex` of the `record` refers to the
   *        original `Iterable` location, where as `previousIndex` refers to the transient location
   *        of the item, after applying the operations up to this point.
   * @param currentIndex The `IterableChangeRecord#currentIndex` of the `record` refers to the
   *        original `Iterable` location, where as `currentIndex` refers to the transient location
   *        of the item, after applying the operations up to this point.
   */
  forEachOperation(
      fn: (
        record: IterableChangeRecord<V>,
        previousIndex: number|null,
        currentIndex: number|null
      ) => void): void;

  /**
   * Iterate over changes in the order of original `Iterable` showing where the original items
   * have moved.
   */
  forEachPreviousItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /** Iterate over all added items. */
  forEachAddedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /** Iterate over all moved items. */
  forEachMovedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /** Iterate over all removed items. */
  forEachRemovedItem(fn: (record: IterableChangeRecord<V>) => void): void;

  /** Iterate over all items which had their identity (as computed by the `TrackByFunction`)
   * changed.
   */
  forEachIdentityChange(fn: (record: IterableChangeRecord<V>) => void): void;
}
