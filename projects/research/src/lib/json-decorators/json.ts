// tslint:disable:prefer-for-of

export const Json = (...includes: string[]) => Class => {

  const json = {};

  Class.prototype.toJSON = function () {

    for (let index = 0; index < includes.length; index++) {
      json[includes[index]] = this[includes[index]];
    }

    return json;
  };

  return Class;
};



export function Ignore(): any {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    Object.defineProperty(target, propertyKey, {
      enumerable: false,
      configurable: false,
      writable: true,
    })
  }
}
