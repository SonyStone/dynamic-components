import { Injectable, OnDestroy } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { DOCUMENT_ID, TargetElementParser, VOID } from 'doc-viewer';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RobotsService implements OnDestroy, TargetElementParser {

  constructor(
    public metaService: Meta,
  ) { }

  ngOnDestroy(): void {
    this.dispose();
  }

  prepare(targetElem: HTMLElement, docId: string): Observable<void> {
    return VOID.pipe(
      tap((v) => console.log(`log-name`, v)),
      tap(() => {
        this.setNoIndex(docId === DOCUMENT_ID.FILE_NOT_FOUND || docId === DOCUMENT_ID.FETCHING_ERROR)
      })
    );
  }

  execute(): Observable<void> {
    return VOID;
  }

  onError(): void {
    this.setNoIndex(true);
  }

  dispose(): void {
    this.metaService.removeTag('name="robots"');
  }

  /**
   * Tell search engine crawlers whether to index this page
   */
  setNoIndex(val: boolean) {
    if (val) {
      this.metaService.addTag({ name: 'robots', content: 'noindex' });
    } else {
      this.metaService.removeTag('name="robots"');
    }
  }
}