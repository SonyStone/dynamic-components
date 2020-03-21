import { stringify } from '@angular/compiler/src/util';

import { isListLikeIterable, iterateListLike, looseIdentical } from '../utils';
import { DuplicateMap } from './duplicate-map';
import { getPreviousIndex } from './get-previous-index';
import { DefaultIterableChangeRecord } from './iterable-change-record';
import { IterableChangeRecord } from './iterable-change-record.interface';
import { IterableChanges } from './iterable-changes.interface';
import { IterableDiffer } from './iterable-differ.interface';
import { TrackByFunction } from './track-by-function.interface';
import { NgIterable } from './ng-iterable.interface';

const trackByIdentity = (index: number, item: any) => item;

export class DefaultIterableDiffer<V> implements IterableDiffer<V>, IterableChanges<V> {
  public readonly length: number = 0;
  public readonly collection: V[] | Iterable<V>| null;
  // Keeps track of the used records at any point in time (during & across `_check()` calls)
  private _linkedRecords: DuplicateMap<V>|null = null;
  // Keeps track of the removed records at any point in time during `_check()` calls.
  private _unlinkedRecords: DuplicateMap<V>|null = null;
  private _previousItHead: DefaultIterableChangeRecord<V>|null = null;
  private _itHead: DefaultIterableChangeRecord<V>|null = null;
  private _itTail: DefaultIterableChangeRecord<V>|null = null;
  private _additionsHead: DefaultIterableChangeRecord<V>|null = null;
  private _additionsTail: DefaultIterableChangeRecord<V>|null = null;
  private _movesHead: DefaultIterableChangeRecord<V>|null = null;
  private _movesTail: DefaultIterableChangeRecord<V>|null = null;
  private _removalsHead: DefaultIterableChangeRecord<V>|null = null;
  private _removalsTail: DefaultIterableChangeRecord<V>|null = null;
  // Keeps track of records where custom track by is the same, but item identity has changed
  private _identityChangesHead: DefaultIterableChangeRecord<V>|null = null;
  private _identityChangesTail: DefaultIterableChangeRecord<V>|null = null;

  constructor(
    private trackByFn: TrackByFunction<V> = trackByIdentity
  ) {}

  forEachItem(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._itHead; record !== null; record = record._next) {
      fn(record);
    }
  }

  forEachOperation(
    fn: (item: IterableChangeRecord<V>, previousIndex: number|null, currentIndex: number|null) => void,
  ) {
    let nextIt = this._itHead;
    let nextRemove = this._removalsHead;
    let addRemoveOffset = 0;
    let moveOffsets: number[]|null = null;

    while (nextIt || nextRemove) {
      // Figure out which is the next record to process
      // Order: remove, add, move
      const record: IterableChangeRecord<V> =
        (!nextRemove || nextIt && nextIt.currentIndex < getPreviousIndex(nextRemove, addRemoveOffset, moveOffsets))
          ? nextIt
          : nextRemove;

      const adjPreviousIndex = getPreviousIndex(record, addRemoveOffset, moveOffsets);
      const currentIndex = record.currentIndex;

      // consume the item, and adjust the addRemoveOffset and update moveDistance if necessary
      if (record === nextRemove) {
        addRemoveOffset--;
        nextRemove = nextRemove._nextRemoved;
      } else {
        nextIt = nextIt._next;
        if (record.previousIndex == null) {
          addRemoveOffset++;
        } else {
          // INVARIANT:  currentIndex < previousIndex
          if (!moveOffsets) moveOffsets = [];
          const localMovePreviousIndex = adjPreviousIndex - addRemoveOffset;
          const localCurrentIndex = currentIndex - addRemoveOffset;
          if (localMovePreviousIndex !== localCurrentIndex) {
            for (let i = 0; i < localMovePreviousIndex; i++) {
              const offset = i < moveOffsets.length ? moveOffsets[i] : (moveOffsets[i] = 0);
              const index = offset + i;
              if (localCurrentIndex <= index && index < localMovePreviousIndex) {
                moveOffsets[i] = offset + 1;
              }
            }
            const previousIndex = record.previousIndex;
            moveOffsets[previousIndex] = localCurrentIndex - localMovePreviousIndex;
          }
        }
      }

      if (adjPreviousIndex !== currentIndex) {
        fn(record, adjPreviousIndex, currentIndex);
      }
    }
  }

  forEachPreviousItem(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._previousItHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }

  forEachAddedItem(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }

  forEachMovedItem(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._movesHead; record !== null; record = record._nextMoved) {
      fn(record);
    }
  }

  forEachRemovedItem(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }

  forEachIdentityChange(fn: (record: DefaultIterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this._identityChangesHead; record !== null; record = record._nextIdentityChange) {
      fn(record);
    }
  }

  diff(collection: NgIterable<V>|null|undefined): DefaultIterableDiffer<V>|null {
    if (collection == null) collection = [];
    if (!isListLikeIterable(collection)) {
      throw new Error(
          `Error trying to diff '${stringify(collection)}'. Only arrays and iterables are allowed`);
    }

    if (this.check(collection)) {
      return this;
    } else {
      return null;
    }
  }

  onDestroy() {}

  check(collection: NgIterable<V>): boolean {
    this._reset();

    let record: DefaultIterableChangeRecord<V>|null = this._itHead;
    let mayBeDirty = false;
    let itemTrackBy: any;

    if (Array.isArray(collection)) {
      (this as{length: number}).length = collection.length;

      for (let index = 0; index < this.length; index++) {
        const item = collection[index];
        itemTrackBy = this.trackByFn(index, item);
        if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
          record = this._mismatch(record, item, itemTrackBy, index);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            // TODO(misko): can we limit this to duplicates only?
            record = this._verifyReinsertion(record, item, itemTrackBy, index);
          }
          if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
        }

        record = record._next;
      }
    } else {
      let index = 0;
      iterateListLike(collection, (item: V) => {
        itemTrackBy = this.trackByFn(index, item);
        if (record === null || !looseIdentical(record.trackById, itemTrackBy)) {
          record = this._mismatch(record, item, itemTrackBy, index);
          mayBeDirty = true;
        } else {
          if (mayBeDirty) {
            // TODO(misko): can we limit this to duplicates only?
            record = this._verifyReinsertion(record, item, itemTrackBy, index);
          }
          if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);
        }
        record = record._next;
        index++;
      });
      (this as{length: number}).length = index;
    }

    this._truncate(record);
    (this as{collection: V[] | Iterable<V>}).collection = collection;

    return this.isDirty;
  }

  /* CollectionChanges is considered dirty if it has any additions, moves, removals, or identity
   * changes.
   */
  get isDirty(): boolean {
    return this._additionsHead !== null || this._movesHead !== null ||
        this._removalsHead !== null || this._identityChangesHead !== null;
  }

  /**
   * Reset the state of the change objects to show no changes. This means set previousKey to
   * currentKey, and clear all of the queues (additions, moves, removals).
   * Set the previousIndexes of moved and added items to their currentIndexes
   * Reset the list of additions, moves and removals
   *
   * @internal
   */
  _reset() {
    if (this.isDirty) {
      let record: DefaultIterableChangeRecord<V>|null;
      let nextRecord: DefaultIterableChangeRecord<V>|null;

      for (record = this._previousItHead = this._itHead; record !== null; record = record._next) {
        record._nextPrevious = record._next;
      }

      for (record = this._additionsHead; record !== null; record = record._nextAdded) {
        record.previousIndex = record.currentIndex;
      }
      this._additionsHead = this._additionsTail = null;

      for (record = this._movesHead; record !== null; record = nextRecord) {
        record.previousIndex = record.currentIndex;
        nextRecord = record._nextMoved;
      }
      this._movesHead = this._movesTail = null;
      this._removalsHead = this._removalsTail = null;
      this._identityChangesHead = this._identityChangesTail = null;

      // TODO(vicb): when assert gets supported
      // assert(!this.isDirty);
    }
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
  _mismatch(record: DefaultIterableChangeRecord<V>|null, item: V, itemTrackBy: any, index: number):
      DefaultIterableChangeRecord<V> {
    // The previous record after which we will append the current one.
    let previousRecord: DefaultIterableChangeRecord<V>|null;

    if (record === null) {
      previousRecord = this._itTail;
    } else {
      previousRecord = record._prev;
      // Remove the record from the collection since we know it does not match the item.
      this._remove(record);
    }

    // Attempt to see if we have seen the item before.
    record = this._linkedRecords === null ? null : this._linkedRecords.get(itemTrackBy, index);
    if (record !== null) {
      // We have seen this before, we need to move it forward in the collection.
      // But first we need to check if identity changed, so we can update in view if necessary
      if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);

      this._moveAfter(record, previousRecord, index);
    } else {
      // Never seen it, check evicted list.
      record = this._unlinkedRecords === null ? null : this._unlinkedRecords.get(itemTrackBy, null);
      if (record !== null) {
        // It is an item which we have evicted earlier: reinsert it back into the list.
        // But first we need to check if identity changed, so we can update in view if necessary
        if (!looseIdentical(record.item, item)) this._addIdentityChange(record, item);

        this._reinsertAfter(record, previousRecord, index);
      } else {
        // It is a new item: add it.
        record =
            this._addAfter(new DefaultIterableChangeRecord<V>(item, itemTrackBy), previousRecord, index);
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
  _verifyReinsertion(
    record: DefaultIterableChangeRecord<V>,
    item: V,
    itemTrackBy: any,
    index: number,
  ): DefaultIterableChangeRecord<V> {
    const reinsertRecord: DefaultIterableChangeRecord<V>|null =
      (this._unlinkedRecords === null)
        ? null
        : this._unlinkedRecords.get(itemTrackBy, null);

    if (reinsertRecord !== null) {
      record = this._reinsertAfter(reinsertRecord, record._prev, index);
    } else if (record.currentIndex !== index) {
      record.currentIndex = index;
      this._addToMoves(record, index);
    }

    return record;
  }

  /**
   * Get rid of any excess {@link IterableChangeRecord_}s from the previous collection
   *
   * - `record` The first excess {@link IterableChangeRecord_}.
   *
   * @internal
   */
  _truncate(record: DefaultIterableChangeRecord<V>|null) {
    // Anything after that needs to be removed;
    while (record !== null) {
      const nextRecord: DefaultIterableChangeRecord<V>|null = record._next;
      this._addToRemovals(this._unlink(record));
      record = nextRecord;
    }
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.clear();
    }

    if (this._additionsTail !== null) {
      this._additionsTail._nextAdded = null;
    }
    if (this._movesTail !== null) {
      this._movesTail._nextMoved = null;
    }
    if (this._itTail !== null) {
      this._itTail._next = null;
    }
    if (this._removalsTail !== null) {
      this._removalsTail._nextRemoved = null;
    }
    if (this._identityChangesTail !== null) {
      this._identityChangesTail._nextIdentityChange = null;
    }
  }

  /** @internal */
  _reinsertAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    if (this._unlinkedRecords !== null) {
      this._unlinkedRecords.remove(record);
    }
    const prev = record._prevRemoved;
    const next = record._nextRemoved;

    if (prev === null) {
      this._removalsHead = next;
    } else {
      prev._nextRemoved = next;
    }
    if (next === null) {
      this._removalsTail = prev;
    } else {
      next._prevRemoved = prev;
    }

    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  }

  /** @internal */
  _moveAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    this._unlink(record);
    this._insertAfter(record, prevRecord, index);
    this._addToMoves(record, index);
    return record;
  }

  /** @internal */
  _addAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    this._insertAfter(record, prevRecord, index);

    if (this._additionsTail === null) {
      // TODO(vicb):
      // assert(this._additionsHead === null);
      this._additionsTail = this._additionsHead = record;
    } else {
      // TODO(vicb):
      // assert(_additionsTail._nextAdded === null);
      // assert(record._nextAdded === null);
      this._additionsTail = this._additionsTail._nextAdded = record;
    }
    return record;
  }

  /** @internal */
  _insertAfter(
      record: DefaultIterableChangeRecord<V>, prevRecord: DefaultIterableChangeRecord<V>|null,
      index: number): DefaultIterableChangeRecord<V> {
    // TODO(vicb):
    // assert(record != prevRecord);
    // assert(record._next === null);
    // assert(record._prev === null);

    const next: DefaultIterableChangeRecord<V>|null =
        prevRecord === null ? this._itHead : prevRecord._next;
    // TODO(vicb):
    // assert(next != record);
    // assert(prevRecord != record);
    record._next = next;
    record._prev = prevRecord;
    if (next === null) {
      this._itTail = record;
    } else {
      next._prev = record;
    }
    if (prevRecord === null) {
      this._itHead = record;
    } else {
      prevRecord._next = record;
    }

    if (this._linkedRecords === null) {
      this._linkedRecords = new DuplicateMap<V>();
    }
    this._linkedRecords.put(record);

    record.currentIndex = index;
    return record;
  }

  /** @internal */
  _remove(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    return this._addToRemovals(this._unlink(record));
  }

  /** @internal */
  _unlink(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    if (this._linkedRecords !== null) {
      this._linkedRecords.remove(record);
    }

    const prev = record._prev;
    const next = record._next;

    // TODO(vicb):
    // assert((record._prev = null) === null);
    // assert((record._next = null) === null);

    if (prev === null) {
      this._itHead = next;
    } else {
      prev._next = next;
    }
    if (next === null) {
      this._itTail = prev;
    } else {
      next._prev = prev;
    }

    return record;
  }

  /** @internal */
  _addToMoves(record: DefaultIterableChangeRecord<V>, toIndex: number): DefaultIterableChangeRecord<V> {
    // TODO(vicb):
    // assert(record._nextMoved === null);

    if (record.previousIndex === toIndex) {
      return record;
    }

    if (this._movesTail === null) {
      // TODO(vicb):
      // assert(_movesHead === null);
      this._movesTail = this._movesHead = record;
    } else {
      // TODO(vicb):
      // assert(_movesTail._nextMoved === null);
      this._movesTail = this._movesTail._nextMoved = record;
    }

    return record;
  }

  private _addToRemovals(record: DefaultIterableChangeRecord<V>): DefaultIterableChangeRecord<V> {
    if (this._unlinkedRecords === null) {
      this._unlinkedRecords = new DuplicateMap<V>();
    }
    this._unlinkedRecords.put(record);
    record.currentIndex = null;
    record._nextRemoved = null;

    if (this._removalsTail === null) {
      // TODO(vicb):
      // assert(_removalsHead === null);
      this._removalsTail = this._removalsHead = record;
      record._prevRemoved = null;
    } else {
      // TODO(vicb):
      // assert(_removalsTail._nextRemoved === null);
      // assert(record._nextRemoved === null);
      record._prevRemoved = this._removalsTail;
      this._removalsTail = this._removalsTail._nextRemoved = record;
    }
    return record;
  }

  /** @internal */
  _addIdentityChange(record: DefaultIterableChangeRecord<V>, item: V) {
    record.item = item;
    if (this._identityChangesTail === null) {
      this._identityChangesTail = this._identityChangesHead = record;
    } else {
      this._identityChangesTail = this._identityChangesTail._nextIdentityChange = record;
    }
    return record;
  }
}







