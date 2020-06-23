import { Injectable } from '@angular/core';
import { TargetElementParser } from 'doc-viewer';

import { TitleService } from '../doc-viewer/title.service';

/**
 * Prepare for setting the ToC.
 * Return a function to actually set them.
 */
@Injectable()
export class TableOfContent implements TargetElementParser {

  constructor(
    private titleService: TitleService,
  ) {}

  prepare(targetElem: HTMLElement, docId: string): void {
    const titleEl = this.titleService.titleElement;
    const needsToc = !!titleEl && !/no-?toc/i.test(titleEl.className);
    const embeddedToc = targetElem.querySelector('aio-toc.embedded');

    if (needsToc && !embeddedToc) {
      // Add an embedded ToC if it's needed and there isn't one in the content already.
      titleEl.insertAdjacentHTML('afterend', '<aio-toc class="embedded"></aio-toc>');
    } else if (!needsToc && embeddedToc) {
      // Remove the embedded Toc if it's there and not needed.
      embeddedToc.remove();
    }
  }

  execute(): void {}

  dispose(): void {}
}