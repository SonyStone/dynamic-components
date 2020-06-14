import { DuplicateItemRecordList } from './duplicate-item-record-list';
import { DefaultIterableChangeRecord } from './iterable-change-record';

export class DuplicateMap<V> {
  map = new Map<any, DuplicateItemRecordList<V>>();

  put(record: DefaultIterableChangeRecord<V>) {
    const key = record.trackById;

    let duplicates = this.map.get(key);
    if (!duplicates) {
      duplicates = new DuplicateItemRecordList<V>();
      this.map.set(key, duplicates);
    }
    duplicates.add(record);
  }

  /**
   * Retrieve the `value` using key. Because the IterableChangeRecord_ value may be one which we
   * have already iterated over, we use the `atOrAfterIndex` to pretend it is not there.
   *
   * Use case: `[a, b, c, a, a]` if we are at index `3` which is the second `a` then asking if we
   * have any more `a`s needs to return the second `a`.
   */
  get(trackById: any, atOrAfterIndex: number|null): DefaultIterableChangeRecord<V>|null {
    const key = trackById;
    const recordList = this.map.get(key);
    return recordList ? recordList.get(trackById, atOrAfterIndex) : null;
  }

  /**
   * Removes a {@link IterableChangeRecord_} from the list of duplicates.
   *
   * The list of duplicates also is removed from the map if it gets empty.
   */
  remove(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    const key = record.trackById;
    const recordList: DuplicateItemRecordList<V> = this.map.get(key);
    // Remove the list of duplicates when it gets empty
    if (recordList.remove(record)) {
      this.map.delete(key);
    }
    return record;
  }

  get isEmpty(): boolean { return this.map.size === 0; }

  clear() { this.map.clear(); }
}