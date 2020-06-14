export const keyvalueChangesAsString = ({
  state = [],
  previous = [],
  additions = [],
  changes = [],
  removals = [],
}): string  => (
  `state: ${state.join(', ')}\n` +
  `previous: ${previous.join(', ')}\n` +
  `additions: ${additions.join(', ')}\n` +
  `changes: ${changes.join(', ')}\n` +
  `removals: ${removals.join(', ')}\n`
);
