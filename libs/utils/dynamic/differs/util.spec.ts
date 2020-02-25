import { stringify } from '@angular/compiler/src/util';
import { IterableChangeRecord, IterableChanges, KeyValueChangeRecord, KeyValueChanges } from '@angular/core';

import { looseIdentical } from './utils';

export function iterableDifferToString<V>(iterableChanges: IterableChanges<V>) {

  // iterableChanges.forEachOperation((
  //   item: IterableChangeRecord<any>,
  //   adjustedPreviousIndex: number | null,
  //   currentIndex: number | null
  // ) => {
  //   if (item.previousIndex == null) {
  //     console.log(`add new item`, item, `to`, currentIndex);
  //   } else if (currentIndex == null) {
  //     console.log(`remove item`, item, `from`, adjustedPreviousIndex);
  //   } else if (adjustedPreviousIndex !== null) {
  //     console.log(`move item`, item, `from`, adjustedPreviousIndex, `to`,  currentIndex);
  //   } else {
  //     console.log(`!!!!!`, item, adjustedPreviousIndex, currentIndex);
  //   }
  // })


  const collection: string[] = [];
  iterableChanges.forEachItem((r) => collection.push(icrAsString(r)));

  const previous: string[] = [];
  iterableChanges.forEachPreviousItem((r) => previous.push(icrAsString(r)));

  const additions: string[] = [];
  iterableChanges.forEachAddedItem((r) => additions.push(icrAsString(r)));

  const moves: string[] = [];
  iterableChanges.forEachMovedItem((r) => moves.push(icrAsString(r)));

  const removals: string[] = [];
  iterableChanges.forEachRemovedItem((r) => removals.push(icrAsString(r)));

  const identityChanges: string[] = [];
  iterableChanges.forEachIdentityChange((r) => identityChanges.push(icrAsString(r)));

  return iterableChangesAsString({
    collection,
    previous,
    additions,
    moves,
    removals,
    identityChanges,
  });
}

function icrAsString<V>(icr: IterableChangeRecord<V>): string {
  return (icr.previousIndex === icr.currentIndex)
    ? stringify(icr.item)
    : `${stringify(icr.item)}[${stringify(icr.previousIndex)}->${stringify(icr.currentIndex)}]`;
}

export function iterableChangesAsString({
  collection = [] as any,
  previous = [] as any,
  additions = [] as any,
  moves = [] as any,
  removals = [] as any,
  identityChanges = [] as any,
}): string {
  return (
    `collection: ${collection.join(', ')}\n` +
    `previous: ${previous.join(', ')}\n` +
    `additions: ${additions.join(', ')}\n` +
    `moves: ${moves.join(', ')}\n` +
    `removals: ${removals.join(', ')}\n` +
    `identityChanges: ${identityChanges.join(', ')}\n`
  );
}


export function testChangesAsString({
  map,
  previous,
  additions,
  changes,
  removals
}: {
  map?: any[],
  previous?: any[],
  additions?: any[],
  changes?: any[],
  removals?: any[]
}): string {
  if (!map) { map = [] };
  if (!previous) { previous = [] };
  if (!additions) { additions = [] };
  if (!changes) { changes = [] };
  if (!removals) { removals = [] };

  return (
    `map: ${map.join(', ')}\n` +
    `previous: ${previous.join(', ')}\n` +
    `additions: ${additions.join(', ')}\n` +
    `changes: ${changes.join(', ')}\n` +
    `removals: ${removals.join(', ')}\n`
  );
}

export function keyvalueDifferToString(kvChanges: KeyValueChanges<string, any>) {

  const map: string[] = [];
  kvChanges.forEachItem(r => map.push(keyvalueChangesAsString(r)));

  const previous: string[] = [];
  kvChanges.forEachPreviousItem(r => previous.push(keyvalueChangesAsString(r)));

  const changes: string[] = [];
  kvChanges.forEachChangedItem(r => changes.push(keyvalueChangesAsString(r)));

  const additions: string[] = [];
  kvChanges.forEachAddedItem(r => additions.push(keyvalueChangesAsString(r)));

  const removals: string[] = [];
  kvChanges.forEachRemovedItem(r => removals.push(keyvalueChangesAsString(r)));

  return testChangesAsString({
    map,
    previous,
    additions,
    changes,
    removals,
  });
}

function keyvalueChangesAsString(kvcr: KeyValueChangeRecord<string, any>) {
  return looseIdentical(kvcr.previousValue, kvcr.currentValue) ?
      stringify(kvcr.key) :
      (stringify(kvcr.key) + '[' + stringify(kvcr.previousValue) + '->' +
       stringify(kvcr.currentValue) + ']');
}
