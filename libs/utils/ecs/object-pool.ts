import { Resettable } from './resettable.interface';

export class ObjectPool<TInstance extends Resettable, TCLass extends new (...args) => TInstance> {
  freeList: TInstance[] = [];
  count = 0;
  isObjectPool = true;

  createElement: () => TInstance;

  // @todo Add initial size
  constructor(
    Class: TCLass,
    initialSize?: number,
  ) {

    let extraArgs = null;

    if (arguments.length > 1) {
      extraArgs = Array.prototype.slice.call(arguments);
      extraArgs.shift();
    }

    this.createElement = extraArgs
      ? () => new Class(...extraArgs)
      : () => new Class();

    if (typeof initialSize !== 'undefined') {
      this.expand(initialSize);
    }
  }

  aquire(): TInstance {
    // Grow the list by 20%ish if we're out
    if (this.freeList.length <= 0) {
      this.expand(Math.round(this.count * 0.2) + 1);
    }

    const item = this.freeList.pop();

    return item;
  }

  release(item: TInstance): void {
    if (item.reset) {
      item.reset();
    }
    this.freeList.push(item);
  }

  expand(count: number): void {
    for (let n = 0; n < count; n++) {
      this.freeList.push(this.createElement());
    }
    this.count += count;
  }

  totalSize(): number {
    return this.count;
  }

  totalFree(): number {
    return this.freeList.length;
  }

  totalUsed(): number {
    return this.count - this.freeList.length;
  }
}
