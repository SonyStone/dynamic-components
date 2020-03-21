import { KeyValueChangeRecord } from './keyvalue-change-record.interface';

export class DefaultKeyValueChangeRecord<K, V> implements KeyValueChangeRecord<K, V> {
  previousValue: V|null = null;
  currentValue: V|null = null;

  /** @internal */
  _nextPrevious: DefaultKeyValueChangeRecord<K, V>|null = null;
  /** @internal */
  _next: DefaultKeyValueChangeRecord<K, V>|null = null;
  /** @internal */
  _prev: DefaultKeyValueChangeRecord<K, V>|null = null;
  /** @internal */
  _nextAdded: DefaultKeyValueChangeRecord<K, V>|null = null;
  /** @internal */
  _nextRemoved: DefaultKeyValueChangeRecord<K, V>|null = null;
  /** @internal */
  _nextChanged: DefaultKeyValueChangeRecord<K, V>|null = null;

  constructor(public key: K) {}
}
