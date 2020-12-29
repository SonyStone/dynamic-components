/**
 * @description
 *
 * Represents a type that a Component or other object is instances of.
 *
 * An example of a `Type` is `MyCustomComponent` class, which in JavaScript is represented by
 * the `MyCustomComponent` constructor function.
 *
 * @publicApi
 */
export declare const Type: FunctionConstructor;

export declare interface Type<T> extends Function {
  new (...args: any[]): T;
}
