import { Injectable } from '@angular/core';
import { DocumentView, TargetElementParser, VOID } from 'doc-viewer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { TitleService } from '../doc-viewer/title.service';
import { TocService } from './toc.service';

/**
 * Prepare for setting the ToC.
 * Return a function to actually set them.
 */
@Injectable()
export class TableOfContent implements TargetElementParser {

  needsToc = false;
  embeddedToc: Element | undefined;

  private view: DocumentView | undefined;

  constructor(
    private titleService: TitleService,
    private tocService: TocService,
  ) {}

  prepare(view: DocumentView): Observable<void> {
    return VOID.pipe(
      tap(() => {
        const titleElement = this.titleService.titleElement;
        this.needsToc = !!titleElement && !/no-?toc/i.test(titleElement.className);
        this.view = view;
        this.embeddedToc = view.container.querySelector('aio-toc.embedded');

        if (this.needsToc && !this.embeddedToc) {
          // Add an embedded ToC if it's needed and there isn't one in the content already.
          titleElement.insertAdjacentHTML('afterend', '<aio-toc class="embedded"></aio-toc>');
        } else if (!this.needsToc && this.embeddedToc) {
          // Remove the embedded Toc if it's there and not needed.
          this.embeddedToc.remove();
        }
      }),
    );
  }

  execute(): Observable<void> {
    return VOID.pipe(
      tap(() => {
        const titleElement = this.titleService.titleElement;

        if (titleElement && this.needsToc) {
          this.tocService.genToc(this.view);
        }
      })
    );
  }

  dispose(): void {}

  onError(err: any): void {}
}