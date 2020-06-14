import { OperatorFunction } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable:ban-types
const isFunctionNotClass = (func: unknown): func is (() => {}) => !/^class\s/.test(Function.prototype.toString.call(func));

export const functionUnpacking = <F>(): OperatorFunction<(() => F) | F, any> =>
  map((functionOrModule) => (typeof functionOrModule === 'function')
    ? (isFunctionNotClass(functionOrModule))
      ? functionOrModule()
      : functionOrModule
    : functionOrModule
  );