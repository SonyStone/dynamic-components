// tslint:disable:ban-types

/**
 * Не подходит для работы со View, так как работает только в рамках своего класса
 * (View уничтожается раньше вызвова ngxBeforeOnDestroy)
 */
export interface BeforeOnDestroy {
  ngxBeforeOnDestroy();
}

type NgxInstance = BeforeOnDestroy & Object;
type Descriptor = TypedPropertyDescriptor<Function>;
type Key = string | symbol;

export function BeforeOnDestroy(target: NgxInstance, key: Key, descriptor: Descriptor) {

  return {
    async value( ... args: any[]) {

      await target.ngxBeforeOnDestroy.apply(this);
      return descriptor.value.apply(this, args);
    }
  };
}
