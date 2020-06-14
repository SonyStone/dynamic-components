import { Injectable, IterableDifferFactory } from '@angular/core';
import { DefaultIterableDiffer, isListLikeIterable, TrackByFunction } from 'differs';


export class DefaultIterableDifferFactory implements IterableDifferFactory {

  supports(obj: any|null|undefined): boolean {
    return isListLikeIterable(obj);
  }

  create<V>(trackByFn?: TrackByFunction<V>): DefaultIterableDiffer<V> {
    return new DefaultIterableDiffer<V>(trackByFn);
  }
}

@Injectable({
  providedIn: 'root',
  useFactory: () => new IterableDiffers([new DefaultIterableDifferFactory()])
})
export class IterableDiffers {
  private factories: IterableDifferFactory[];

  constructor(factories: IterableDifferFactory[]) {
    this.factories = factories;
  }

  find(iterable: any): IterableDifferFactory {
    const factory = this.factories.find(f => f.supports(iterable));
    if (factory != null) {
      return factory;
    } else {
      throw new Error(
          `Cannot find a differ supporting object '${iterable}' of type '${getTypeNameForDebugging(iterable)}'`);
    }
  }
}

export function getTypeNameForDebugging(type: any): string {
  return type.name || typeof type;
}