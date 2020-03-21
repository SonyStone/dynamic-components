import { IterableChanges } from '../iterable-differ/iterable-changes.interface';
import { iterableChangeRecordAsString } from './iterable-change-record-as-string';
import { iterableChangesAsString } from './iterable-changes-as-string';

export function iterableDifferToString<V>(iterableChanges: IterableChanges<V>) {

  const collection: string[] = [];
  iterableChanges.forEachItem((r) => collection.push(iterableChangeRecordAsString(r)));

  const previous: string[] = [];
  iterableChanges.forEachPreviousItem((r) => previous.push(iterableChangeRecordAsString(r)));

  const additions: string[] = [];
  iterableChanges.forEachAddedItem((r) => additions.push(iterableChangeRecordAsString(r)));

  const moves: string[] = [];
  iterableChanges.forEachMovedItem((r) => moves.push(iterableChangeRecordAsString(r)));

  const removals: string[] = [];
  iterableChanges.forEachRemovedItem((r) => removals.push(iterableChangeRecordAsString(r)));

  const identityChanges: string[] = [];
  iterableChanges.forEachIdentityChange((r) => identityChanges.push(iterableChangeRecordAsString(r)));

  return iterableChangesAsString({
    collection,
    previous,
    additions,
    moves,
    removals,
    identityChanges,
  });
}
