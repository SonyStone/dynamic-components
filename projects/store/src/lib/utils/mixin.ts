import { Constructor } from './constructor';

// tslint:disable:only-arrow-functions
// tslint:disable:max-line-length

class MixinBase {}

export type MixinFunction<R, T extends Constructor<{}> = Constructor<{}>> = (base: T) => R & T;

export function mixin<A>(op1: MixinFunction<A>): A & typeof MixinBase;
export function mixin<A, B>(op1: MixinFunction<A>, op2: MixinFunction<B>): A & B & typeof MixinBase;
export function mixin<A, B, C>(op1: MixinFunction<A>, op2: MixinFunction<B>, op3: MixinFunction<C>): A & B & C & typeof MixinBase;
export function mixin<A, B, C, D>(op1: MixinFunction<A>, op2: MixinFunction<B>, op3: MixinFunction<C>, op4: MixinFunction<D>): A & B & C & D & typeof MixinBase;
/** Boilerplate for applying mixins  */
export function mixin(...mixinFunction: ((base: any) => any)[]): typeof MixinBase {

  return mixinFunction.reduce((accumulator, value) => value(accumulator), MixinBase);
}
