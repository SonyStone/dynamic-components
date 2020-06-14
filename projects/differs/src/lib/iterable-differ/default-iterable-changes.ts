import { getPreviousIndex } from './get-previous-index';
import { DefaultIterableChangeRecord } from './iterable-change-record';
import { IterableChangeRecord } from './iterable-change-record.interface';
import { IterableChangeRecors } from './iterable-change-recors';
import { IterableChanges } from './iterable-changes.interface';


export class DefaultIterableChanges<V> implements IterableChanges<V> {

  constructor(
    private changeRecors: IterableChangeRecors<V>,
  ) {}

  forEachItem(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.itHead; record !== null; record = record._next) {
      fn(record);
    }
  }

  forEachOperation(
    fn: (item: IterableChangeRecord<V>, previousIndex: number|null, currentIndex: number|null) => void,
  ) {
    let nextIt = this.changeRecors.itHead;
    let nextRemove = this.changeRecors.removalsHead;
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

  forEachPreviousItem(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.previousItHead; record !== null; record = record._nextPrevious) {
      fn(record);
    }
  }

  forEachAddedItem(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.additionsHead; record !== null; record = record._nextAdded) {
      fn(record);
    }
  }

  forEachMovedItem(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.movesHead; record !== null; record = record._nextMoved) {
      fn(record);
    }
  }

  forEachRemovedItem(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.removalsHead; record !== null; record = record._nextRemoved) {
      fn(record);
    }
  }

  forEachIdentityChange(fn: (record: IterableChangeRecord<V>) => void) {
    let record: DefaultIterableChangeRecord<V>|null;
    for (record = this.changeRecors.identityChangesHead; record !== null; record = record._nextIdentityChange) {
      fn(record);
    }
  }
}
