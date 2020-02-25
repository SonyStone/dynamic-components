/**
 * Record representing the item change information.
 *
 * @publicApi
 */
export interface IterableChangeRecord<V> {
  /**
   * Current index of the item in `Iterable` or null if removed.
   */
  readonly currentIndex: number|null;

  /**
   * Previous index of the item in `Iterable` or null if added.
   */
  readonly previousIndex: number|null;

  /**
   * The item.
   */
  readonly item: V;

  /**
   * Track by identity as computed by the `TrackByFunction`.
   */
  readonly trackById: any;
}