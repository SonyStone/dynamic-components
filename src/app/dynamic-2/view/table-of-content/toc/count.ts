export function count<T>(array: T[], fn: (item: T) => boolean) {
  return array.reduce((result, item) => fn(item) ? result + 1 : result, 0);
}
