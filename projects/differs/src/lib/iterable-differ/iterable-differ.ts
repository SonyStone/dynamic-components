import { stringify } from '@angular/compiler/src/util';

import { isListLikeIterable } from '../utils/is-list-like-iterable';
import { looseIdentical } from '../utils/loose-identical';
import { DefaultIterableChanges } from './default-iterable-changes';
import { DefaultIterableChangeRecord } from './iterable-change-record';
import { IterableChangeRecors } from './iterable-change-recors';
import { IterableChanges } from './iterable-changes.interface';
import { IterableDiffer } from './iterable-differ.interface';
import { NgIterable } from './ng-iterable.interface';
import { TrackByFunction } from './track-by-function.interface';

const trackByIdentity = (index: number, item: any) => item;


export class DefaultIterableDiffer<V> implements IterableDiffer<V> {
  public readonly length: number = 0;
  public readonly collection: V[] | Iterable<V>| null;

  changeRecors = new IterableChangeRecors<V>();
  changes: IterableChanges<V> = new DefaultIterableChanges(this.changeRecors);

  constructor(
    private trackByFn: TrackByFunction<V> = trackByIdentity
  ) {}


  diff(collection: NgIterable<V>|null|undefined): IterableChanges<V>|null {

    if (collection == null) {
      collection = [];
    }

    if (!isListLikeIterable(collection)) {
      throw new Error(
        `Error trying to diff '${stringify(collection)}'. Only arrays and iterables are allowed`
      );
    }

    if (this.check(collection)) {
      return this.changes;
    }

    return null;
  }

  check(collection: NgIterable<V>): boolean {
    this.changeRecors.reset();

    let record: DefaultIterableChangeRecord<V>|null = this.changeRecors.itHead;
    let mayBeDirty = false;

    let index = 0;
    for (const item of collection) {

      const itemTrackBy = this.trackByFn(index, item);

      if (
        record === null
        || !looseIdentical(record.trackById, itemTrackBy)
      ) {
        record = this.changeRecors.mismatch(record, item, itemTrackBy, index);
        mayBeDirty = true;
      } else {
        if (mayBeDirty) {
          // TODO(misko): can we limit this to duplicates only?
          record = this.changeRecors.verifyReinsertion(record, item, itemTrackBy, index);
        }
        if (!looseIdentical(record.item, item)) {
          this.changeRecors.addIdentityChange(record, item)
        };
      }
      record = record._next;
      index++;
    };

    (this.length as number) = index;

    this.changeRecors.truncate(record);
    (this.collection as V[] | Iterable<V>) = collection;

    return this.changeRecors.isDirty;
  }
}
