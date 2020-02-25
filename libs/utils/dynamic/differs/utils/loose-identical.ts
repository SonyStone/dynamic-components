// JS has NaN !== NaN
export function looseIdentical(a: any, b: any): boolean {
  return a === b
    || typeof a === 'number' && typeof b === 'number'
        && isNaN(a) && isNaN(b);
}