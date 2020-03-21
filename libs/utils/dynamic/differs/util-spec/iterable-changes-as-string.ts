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
