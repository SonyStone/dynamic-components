export type KeyValue<K, V> =
  Map<K, V>
  | { [k: string]: V; }
  | { [k: number]: V; }