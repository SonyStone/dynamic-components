import { Component } from './component';

export type ComponentConstructor<T extends Component> =
  new (...args: any) => T;
