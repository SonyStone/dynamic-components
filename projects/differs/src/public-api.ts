/*
 * Public API Surface of differs
 */

/**
 * iterable-differ
 */
export { DefaultIterableDiffer } from './lib/iterable-differ/iterable-differ';

export { IterableChangeRecord } from './lib/iterable-differ/iterable-change-record.interface';
export { IterableDiffer } from './lib/iterable-differ/iterable-differ.interface';
export { TrackByFunction } from './lib/iterable-differ/track-by-function.interface';

/**
 * keyvalue-differ
 */
export { DefaultKeyValueDiffer } from './lib/keyvalue-differ/keyvalue-differ';

export { KeyValueDifferWithBounds } from './lib/keyvalue-differ/keyvalue-differ-with-bounds';
export { KeyValueChangeRecord } from './lib/keyvalue-differ/keyvalue-change-record.interface';
export { KeyValueChanges } from './lib/keyvalue-differ/keyvalue-changes.interface';
export { KeyValueDiffer } from './lib/keyvalue-differ/keyvalue-differ.interface';

/**
 * utils
 */
export { isListLikeIterable } from './lib/utils/is-list-like-iterable';