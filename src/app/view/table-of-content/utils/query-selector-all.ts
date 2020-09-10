export function querySelectorAll<K extends keyof HTMLElementTagNameMap>(parent: Element, selector: K): HTMLElementTagNameMap[K][];
export function querySelectorAll<K extends keyof SVGElementTagNameMap>(parent: Element, selector: K): SVGElementTagNameMap[K][];
export function querySelectorAll<E extends Element = Element>(parent: Element, selector: string): E[];
export function querySelectorAll(parent: Element, selector: string) {
  // Wrap the `NodeList` as a regular `Array` to have access to array methods.
  // NOTE: IE11 does not even support some methods of `NodeList`, such as
  //       [NodeList#forEach()](https://developer.mozilla.org/en-US/docs/Web/API/NodeList/forEach).
  return Array.from(parent.querySelectorAll(selector));
}
