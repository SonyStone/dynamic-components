import { Component } from '../component';
import { getName } from './get-name';

/**
 * Return a valid property name for the Component
 */
export function componentPropertyName(component: Component) {
  const name = getName(component);
  return name.charAt(0).toLowerCase() + name.slice(1);
}
