import { Resettable } from 'object-pool';

import { DOCUMENT_ID, DocumentContents } from './document-contents.interface';

export class DocumentView implements DocumentContents, Resettable {
  /** The unique identifier for this document */
  id: string | DOCUMENT_ID;
  /** The HTML to display in the doc viewer */
  contents: string|null;

  container: HTMLElement|undefined;

  set(container: HTMLElement): this {
    this.container = container;

    return this;
  }

  swap(container: HTMLElement): HTMLElement {
    const viewContainer = this.container;

    this.container = container;

    return viewContainer;
  }

  update({ contents, id }: DocumentContents): void {
    this.contents = contents;
    this.container.innerHTML = contents || ''
    this.id = id;
  }

  reset(): void {
    this.id = undefined;
    this.contents = '';
    this.container.innerHTML = '';
  }
}