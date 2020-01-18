import { Resettable } from '../resettable.interface';

export class DummyObjectPool<TInstance extends Resettable, TCLass extends new (...args) => TInstance> {
  isDummyObjectPool = true;
  count = 0;
  used = 0;

  constructor(
    private T: TCLass
  ) {}

  aquire(): TInstance {
    this.used++;
    this.count++;
    return new this.T();
  }

  release(): void {
    this.used--;
  }

  totalSize(): number {
    return this.count;
  }

  totalFree(): number {
    return Infinity;
  }

  totalUsed(): number {
    return this.used;
  }
}
