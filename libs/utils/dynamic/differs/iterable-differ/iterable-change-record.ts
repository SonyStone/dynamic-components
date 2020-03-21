import { IterableChangeRecord } from './iterable-change-record.interface';

export class DefaultIterableChangeRecord<V> implements IterableChangeRecord<V> {
  currentIndex: number|null = null;
  previousIndex: number|null = null;

  /** @internal */
  _nextPrevious: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _prev: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _next: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _prevDup: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _nextDup: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _prevRemoved: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _nextRemoved: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _nextAdded: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _nextMoved: DefaultIterableChangeRecord<V>|null = null;
  /** @internal */
  _nextIdentityChange: DefaultIterableChangeRecord<V>|null = null;


  constructor(public item: V, public trackById: any) {}
}