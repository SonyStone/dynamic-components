import { KeyValueChanges } from './keyvalue-changes.interface';

/**
 * A differ that tracks changes made to an object over time.
 *
 * @publicApi
 */
export interface KeyValueDiffer<K, V> {
  /**
   * Compute a difference between the previous state and the new `object` state.
   *
   * @param object containing the new value.
   * @returns an object describing the difference. The return value is only valid until the next
   * `diff()` invocation.
   */
  diff(object: Map<K, V>): KeyValueChanges<K, V>|null;

  /**
   * Compute a difference between the previous state and the new `object` state.
   *
   * @param object containing the new value.
   * @returns an object describing the difference. The return value is only valid until the next
   * `diff()` invocation.
   */
  diff(object: {[key: string]: V}): KeyValueChanges<string, V>|null;
  // TODO(TS2.1): diff<KP extends string>(this: KeyValueDiffer<KP, V>, object: Record<KP, V>):
  // KeyValueDiffer<KP, V>;
}
