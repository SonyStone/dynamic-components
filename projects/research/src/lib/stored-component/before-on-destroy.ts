// tslint:disable:ban-types

export interface BeforeOnDestroy {
  ngxBeforeOnDestroy();
}

type NgxInstance = BeforeOnDestroy & Object;
type Descriptor = TypedPropertyDescriptor<Function>;
type Key = string | symbol;

export function BeforeOnDestroy(target: NgxInstance, key: Key, descriptor: Descriptor) {
  return {
      value: async function( ... args: any[]) {
          await target.ngxBeforeOnDestroy.apply(this);
          return descriptor.value.apply(target, args);
      }
  }
}

// export function BeforeOnDestroy() {
//   return (target: NgxInstance, key: Key, descriptor: Descriptor) => {

//     console.log(`BeforeOnDestroy`, target, key, descriptor)

//     descriptor.value = ( ... args: any[]) => {
//       console.log(`call BeforeOnDestroy`, target, key, descriptor)
//       target.ngxBeforeOnDestroy.apply(this);
//       return descriptor.value.apply(target, args);
//     }
//   }
// }