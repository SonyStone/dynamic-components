import { timer } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { raf } from './utils/request-animation-frame-operator';
import { VOID } from './utils/void';

// Get the actual transition duration (taking global styles into account).
// According to the [CSSOM spec](https://drafts.csswg.org/cssom/#serializing-css-values),
// `time` values should be returned in seconds.
const getActualDuration = (elem: HTMLElement) => {
  const cssValue = getComputedStyle(elem).transitionDuration || '';
  const seconds = Number(cssValue.replace(/s$/, ''));
  return 1000 * seconds;
};

// Some properties are not assignable and thus cannot be animated.
// Example methods, readonly and CSS properties:
// "length", "parentRule", "getPropertyPriority", "getPropertyValue", "item", "removeProperty", "setProperty"
type StringValueCSSStyleDeclaration =
  Exclude<{
    [K in keyof CSSStyleDeclaration]: CSSStyleDeclaration[K] extends string ? K : never
  }[keyof CSSStyleDeclaration], number>
  | 'length'
  | 'parentRule' ;


export const animateProp = (
  elem: HTMLElement,
  prop: StringValueCSSStyleDeclaration,
  from: string,
  to: string,
  duration = 200
) => {
    if (prop === 'length' || prop === 'parentRule') {
      // We cannot animate length or parentRule properties because they are readonly
      return VOID;
    }

    elem.style.transition = '';

    return VOID.pipe(
        // In order to ensure that the `from` value will be applied immediately (i.e.
        // without transition) and that the `to` value will be affected by the
        // `transition` style, we need to ensure an animation frame has passed between
        // setting each style.
        raf(),
        tap(() => elem.style[prop] = from),
        raf(),
        tap(() => elem.style.transition = `all ${duration}ms ease-in-out`),
        raf(),
        tap(() => elem.style[prop] = to),
        switchMap(() => timer(getActualDuration(elem))),
        switchMap(() => VOID),
      );
    };

export const animateNoopProp = (
  elem: HTMLElement,
  prop: StringValueCSSStyleDeclaration,
  from: string,
  to: string,
) => {
  if (prop === 'length' || prop === 'parentRule') {
    // We cannot animate length or parentRule properties because they are readonly
    return VOID;
  }

  return VOID.pipe(tap(() => elem.style[prop] = to))
}