import { looseIdentical } from '../utils';
import { DuplicateMap } from './duplicate-map';
import { DefaultIterableChangeRecord } from './iterable-change-record';

export class IterableChangeRecors<V> {
  // Keeps track of the used records at any point in time (during & across `_check()` calls)
  linkedRecords: DuplicateMap<V>|null = null;
  // Keeps track of the removed records at any point in time during `_check()` calls.
  unlinkedRecords: DuplicateMap<V>|null = null;

  previousItHead: DefaultIterableChangeRecord<V>|null = null;

  itHead: DefaultIterableChangeRecord<V>|null = null;
  itTail: DefaultIterableChangeRecord<V>|null = null;

  additionsHead: DefaultIterableChangeRecord<V>|null = null;
  additionsTail: DefaultIterableChangeRecord<V>|null = null;

  movesHead: DefaultIterableChangeRecord<V>|null = null;
  movesTail: DefaultIterableChangeRecord<V>|null = null;

  removalsHead: DefaultIterableChangeRecord<V>|null = null;
  removalsTail: DefaultIterableChangeRecord<V>|null = null;

  // Keeps track of records where custom track by is the same, but item identity has changed
  identityChangesHead: DefaultIterableChangeRecord<V>|null = null;
  identityChangesTail: DefaultIterableChangeRecord<V>|null = null;

  /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
   * changes.
   */
  get isDirty(): boolean {
    return this.additionsHead !== null
      || this.movesHead !== null
      || this.removalsHead !== null
      || this.identityChangesHead !== null;
  }

  /**
   * Reset the state of the change objects to show no changes. This means set previousKey to
   * currentKey, and clear all of the queues (additions, moves, removals).
   * Set the previousIndexes of moved and added items to their currentIndexes
   * Reset the list of additions, moves and removals
   *
   * @internal
   */
  reset() {
    if (this.isDirty) {
      let record: DefaultIterableChangeRecord<V>|null;
      let nextRecord: DefaultIterableChangeRecord<V>|null;

      for (record = this.previousItHead = this.itHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }

      for (record = this.additionsHead; record !== null; record = record._nextAdded) {
        record.previousIndex = record.currentIndex;
      }
      this.additionsHead = this.additionsTail = null;

      for (record = this.movesHead; record !== null; record = nextRecord) {
        record.previousIndex = record.currentIndex;
        nextRecord = record._nextMoved;
      }
      this.movesHead = this.movesTail = null;
      this.removalsHead = this.removalsTail = null;
      this.identityChangesHead = this.identityChangesTail = null;

      // TODO(vicb): when assert gets supported
      // assert(!this.isDirty);
    }
  }

  private addToRemovals(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    if (this.unlinkedRecords === null) {
      this.unlinkedRecords = new DuplicateMap<V>();
    }
    this.unlinkedRecords.put(record);
    record.currentIndex = null;
    record._nextRemoved = null;

    if (this.removalsTail === null) {
      // TODO(vicb):
      // assert(_removalsHead === null);
      this.removalsTail = this.removalsHead = record;
      record._prevRemoved = null;
    } else {
      // TODO(vicb):
      // assert(_removalsTail._nextRemoved === null);
      // assert(record._nextRemoved === null);
      record._prevRemoved = this.removalsTail;
      this.removalsTail = this.removalsTail._nextRemoved = record;
    }
    return record;
  }

  /** @internal */
  addIdentityChange(record: DefaultIterableChangeRecord<V>, item: V) {
    record.item = item;
    if (this.identityChangesTail === null) {
      this.identityChangesTail = this.identityChangesHead = record;
    } else {
      this.identityChangesTail = this.identityChangesTail._nextIdentityChange = record;
    }
    return record;
  }

  /**
   * This is the core function which handles differences between collections.
   *
   * - `record` is the record which we saw at this position last time. If null then it is a new
   *   item.
   * - `item` is the current item in the collection
   * - `index` is the position of the item in the collection
   *
   * @internal
   */
  mismatch(record: DefaultIterableChangeRecord<V>|null, item: V, itemTrackBy: any, index: number):
      DefaultIterableChangeRecord<V> {
    // The previous record after which we will append the current one.
    let previousRecord: DefaultIterableChangeRecord<V>|null;

    if (record === null) {
      previousRecord = this.itTail;
    } else {
      previousRecord = record._prev;
      // Remove the record from the collection since we know it does not match the item.
      this.remove(record);
    }

    // Attempt to see if we have seen the item before.
    record = this.linkedRecords === null ? null : this.linkedRecords.get(itemTrackBy, index);
    if (record !== null) {
      // We have seen this before, we need to move it forward in the collection.
      // But first we need to check if identity changed, so we can update in view if necessary
      if (!looseIdentical(record.item, item)) this.addIdentityChange(record, item);

      this.moveAfter(record, previousRecord, index);
    } else {
      // Never seen it, check evicted list.
      record = this.unlinkedRecords === null ? null : this.unlinkedRecords.get(itemTrackBy, null);
      if (record !== null) {
        // It is an item which we have evicted earlier: reinsert it back into the list.
        // But first we need to check if identity changed, so we can update in view if necessary
        if (!looseIdentical(record.item, item)) this.addIdentityChange(record, item);

        this.reinsertAfter(record, previousRecord, index);
      } else {
        // It is a new item: add it.
        record =
            this.addAfter(new DefaultIterableChangeRecord<V>(item, itemTrackBy), previousRecord, index);
      }
    }
    return record;
  }

  /**
   * This check is only needed if an array contains duplicates. (Short circuit of nothing dirty)
   *
   * Use case: `[a, a]` => `[b, a, a]`
   *
   * If we did not have this check then the insertion of `b` would:
   *   1) evict first `a`
   *   2) insert `b` at `0` index.
   *   3) leave `a` at index `1` as is. <-- this is wrong!
   *   3) reinsert `a` at index 2. <-- this is wrong!
   *
   * The correct behavior is:
   *   1) evict first `a`
   *   2) insert `b` at `0` index.
   *   3) reinsert `a` at index 1.
   *   3) move `a` at from `1` to `2`.
   *
   *
   * Double check that we have not evicted a duplicate item. We need to check if the item type may
   * have already been removed:
   * The insertion of b will evict the first 'a'. If we don't reinsert it now it will be reinserted
   * at the end. Which will show up as the two 'a's switching position. This is incorrect, since a
   * better way to think of it is as insert of 'b' rather then switch 'a' with 'b' and then add 'a'
   * at the end.
   *
   * @internal
   */
  verifyReinsertion(
    record: DefaultIterableChangeRecord<V>,
    item: V,
    itemTrackBy: any,
    index: number,
  ): DefaultIterableChangeRecord<V> {
    const reinsertRecord: DefaultIterableChangeRecord<V>|null =
      (this.unlinkedRecords === null)
        ? null
        : this.unlinkedRecords.get(itemTrackBy, null);

    if (reinsertRecord !== null) {
      record = this.reinsertAfter(reinsertRecord, record._prev, index);
    } else if (record.currentIndex !== index) {
      record.currentIndex = index;
      this.addToMoves(record, index);
    }

    return record;
  }

  /**
   * Get rid of any excess {@link IterableChangeRecord_}s from the previous collection
   *
   * - `record` The first excess {@link IterableChangeRecord_}.
   *
   */
  truncate(record: DefaultIterableChangeRecord<V>|null) {
    // Anything after that needs to be removed;
    while (record !== null) {
      const nextRecord: DefaultIterableChangeRecord<V>|null = record._next;
      this.addToRemovals(this.unlink(record));
      record = nextRecord;
    }
    if (this.unlinkedRecords !== null) {
      this.unlinkedRecords.clear();
    }

    if (this.additionsTail !== null) {
      this.additionsTail._nextAdded = null;
    }
    if (this.movesTail !== null) {
      this.movesTail._nextMoved = null;
    }
    if (this.itTail !== null) {
      this.itTail._next = null;
    }
    if (this.removalsTail !== null) {
      this.removalsTail._nextRemoved = null;
    }
    if (this.identityChangesTail !== null) {
      this.identityChangesTail._nextIdentityChange = null;
    }
  }

  /** @internal */
  private reinsertAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    if (this.unlinkedRecords !== null) {
      this.unlinkedRecords.remove(record);
    }
    const prev = record._prevRemoved;
    const next = record._nextRemoved;

    if (prev === null) {
      this.removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this.removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }

    this.insertAfter(record, prevRecord, index);
    this.addToMoves(record, index);
    return record;
  }

  /** @internal */
  private moveAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    this.unlink(record);
    this.insertAfter(record, prevRecord, index);
    this.addToMoves(record, index);
    return record;
  }

  /** @internal */
  private addAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    this.insertAfter(record, prevRecord, index);

    if (this.additionsTail === null) {
      // TODO(vicb):
      // assert(this._additionsHead === null);
      this.additionsTail = this.additionsHead = record;
    } else {
      // TODO(vicb):
      // assert(_additionsTail._nextAdded === null);
      // assert(record._nextAdded === null);
      this.additionsTail = this.additionsTail._nextAdded = record;
    }
    return record;
  }

  /** @internal */
  private insertAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    // TODO(vicb):
    // assert(record != prevRecord);
    // assert(record._next === null);
    // assert(record._prev === null);

    const next: DefaultIterableChangeRecord<V>|null =
        prevRecord === null ? this.itHead : prevRecord._next;
    // TODO(vicb):
    // assert(next != record);
    // assert(prevRecord != record);
    record._next = next;
    record._prev = prevRecord;
    if (next === null) {
      this.itTail = record;
    } else {
      next._prev = record;
    }
    if (prevRecord === null) {
      this.itHead = record;
    } else {
      prevRecord._next = record;
    }

    if (this.linkedRecords === null) {
      this.linkedRecords = new DuplicateMap<V>();
    }
    this.linkedRecords.put(record);

    record.currentIndex = index;
    return record;
  }

  /** @internal */
  private remove(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    return this.addToRemovals(this.unlink(record));
  }

  /** @internal */
  private unlink(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    if (this.linkedRecords !== null) {
      this.linkedRecords.remove(record);
    }

    const prev = record._prev;
    const next = record._next;

    // TODO(vicb):
    // assert((record._prev = null) === null);
    // assert((record._next = null) === null);

    if (prev === null) {
      this.itHead = next;
    } else {
      prev._next = next;
    }
    if (next === null) {
      this.itTail = prev;
    } else {
      next._prev = prev;
    }

    return record;
  }

  private addToMoves(record: DefaultIterableChangeRecord<V>, toIndex: number): DefaultIterableChangeRecord<V> {
    // TODO(vicb):
    // assert(record._nextMoved === null);

    if (record.previousIndex === toIndex) {
      return record;
    }

    if (this.movesTail === null) {
      // TODO(vicb):
      // assert(_movesHead === null);
      this.movesTail = this.movesHead = record;
    } else {
      // TODO(vicb):
      // assert(_movesTail._nextMoved === null);
      this.movesTail = this.movesTail._nextMoved = record;
    }

    return record;
  }
}
