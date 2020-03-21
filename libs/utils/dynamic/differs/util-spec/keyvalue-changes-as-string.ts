export function keyvalueChangesAsString({
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
