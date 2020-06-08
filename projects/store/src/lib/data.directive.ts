import { Directive } from '@angular/core';

import { ContextView } from './view-context.service';

@Directive({
  selector: '[data]',
})
export class DataDirective {

  private map = new Map<string, () => ContextView<any>>();

  get<T>(key: string | undefined): () => ContextView<T> {
    const value = this.map.get(key);
    if (value) {
      return value;
    }

    return;
  }

  setRoot(key: string, root: () => ContextView<any>): void {
    this.map.set(key, root);
  }
}
