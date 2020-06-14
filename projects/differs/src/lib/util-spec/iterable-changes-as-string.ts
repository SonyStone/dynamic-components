export const iterableChangesAsString = ({
  state = [],
  previous = [],
  additions = [],
  moves = [],
  removals = [],
  identityChanges = [],
}): string => (
  `state: ${state.join(', ')}\n` +
  `previous: ${previous.join(', ')}\n` +
  `additions: ${additions.join(', ')}\n` +
  `moves: ${moves.join(', ')}\n` +
  `removals: ${removals.join(', ')}\n` +
  `identityChanges: ${identityChanges.join(', ')}\n`
);
