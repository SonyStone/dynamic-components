import { DefaultIterableChangeRecord } from './iterable-change-record';
import { looseIdentical } from '../utils/loose-identical';

// A linked list of CollectionChangeRecords with the same IterableChangeRecord_.item
export class DuplicateItemRecordList<V> {
  /** @internal */
  _head: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _tail: DefaultIterableChangeRecord<V>|null = null;

  /**
   * Append the record to the list of duplicates.
   *
   * Note: by design all records in the list of duplicates hold the same value in record.item.
   */
  add(record: DefaultIterableChangeRecord<V>): void {
    if (this._head === null) {
      this._head = this._tail = record;
      record._nextDup = null;
      record._prevDup = null;
    } else {
      // TODO(vicb):
      // assert(record.item ==  _head.item ||
      //       record.item is num && record.item.isNaN && _head.item is num && _head.item.isNaN);
      this._tail._nextDup = record;
      record._prevDup = this._tail;
      record._nextDup = null;
      this._tail = record;
    }
  }

  // Returns a IterableChangeRecord_ having IterableChangeRecord_.trackById == trackById and
  // IterableChangeRecord_.currentIndex >= atOrAfterIndex
  get(trackById: any, atOrAfterIndex: number|null): DefaultIterableChangeRecord<V>|null {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._head; record !== null; record = record._nextDup) {
      if ((atOrAfterIndex === null || atOrAfterIndex <= record.currentIndex) &&
          looseIdentical(record.trackById, trackById)) {
        return record;
      }
    }

    return null;
  }

  /**
   * Remove one {@link IterableChangeRecord_} from the list of duplicates.
   *
   * Returns whether the list of duplicates is empty.
   */
  remove(record: DefaultIterableChangeRecord<V>): boolean {

    const prev: DefaultIterableChangeRecord<V>|null = record._prevDup;
    const next: DefaultIterableChangeRecord<V>|null = record._nextDup;

    if (prev === null) {
      this._head = next;
    } else {
      prev._nextDup = next;
    }
    if (next === null) {
      this._tail = prev;
    } else {
      next._prevDup = prev;
    }

    return this._head === null;
  }
}
