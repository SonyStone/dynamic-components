/**
 * Record representing the item change information.
 *
 * @publicApi
 */
export interface KeyValueChangeRecord<K, V> {
  /**
   * Current key in the Map.
   */
  readonly key: K;

  /**
   * Current value for the key or `null` if removed.
   */
  readonly currentValue: V|null;

  /**
   * Previous value for the key or `null` if added.
   */
  readonly previousValue: V|null;
}