import { Injectable, OnDestroy } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TargetElementParser, VOID } from 'doc-viewer';
import { Observable } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

/**
 * Prepare for setting the window title.
 */
@Injectable()
export class TitleService implements OnDestroy, TargetElementParser {

  titleElement: HTMLHeadingElement | undefined;
  title: string | undefined = '';
  formattedTitle: string | undefined = '';

  private defaultTitle: string | undefined = '';

  constructor(
    private titleService: Title,
  ) {
    this.defaultTitle = this.titleService.getTitle();
  }

  ngOnDestroy(): void {
    this.dispose();
  }

  prepare(targetElem: HTMLElement, docId: string): Observable<void> {
    return VOID.pipe(
      tap(() => {
        this.titleElement = targetElem.querySelector('h1');
      })
    );
  }

  execute(): Observable<void> {
    return VOID.pipe(
      tap(() => {
        if (this.titleElement) {
          this.title = (typeof this.titleElement.innerText === 'string')
            ? this.titleElement.innerText
            : this.titleElement.textContent;
        }

        this.formattedTitle = this.title ? `RxJS - ${this.title}` : 'RxJS';

        this.titleService.setTitle(this.formattedTitle);
      })
    );
  }

  dispose(): void {
    this.titleService.setTitle(this.defaultTitle);
  }

  onError(): void {
    this.dispose();
  }
}

@Injectable()
export class MetaTagsService implements OnDestroy, TargetElementParser {

  descriptionElement: Element | undefined;
  description: string | undefined;

  constructor(
    private titleService: TitleService,
    private metaService: Meta,
  ) {}

  ngOnDestroy(): void {
    this.dispose();
  }

  prepare(targetElem: HTMLElement, docId: string): Observable<void> {
    return VOID.pipe(
      tap(() => {
        this.descriptionElement = targetElem.querySelector('.api-body > p:nth-child(2)');
      })
    );
  }

  execute(): Observable<void> {
    return VOID.pipe(
      tap(() => {
        if (this.descriptionElement) {
          this.description = this.descriptionElement.innerHTML;
        }
        const formattedTitle =this.titleService.formattedTitle

        this.addDocumentMetaTags(formattedTitle, this.description);
      })
    );
  }

  dispose(): void {
    this.metaService.removeTag('name="twitter:title"');
    this.metaService.removeTag('name="twitter:card"');
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:type"');
    this.metaService.removeTag('name="twitter:description"');
    this.metaService.removeTag('property="og:description"');
  }

  onError(): void {
    this.dispose();
  }


  private addDocumentMetaTags(title: string, description: string | null): void {
    this.metaService.updateTag({ name: 'twitter:title', content: title });
    this.metaService.updateTag({ name: 'twitter:card', content: 'summary' });
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    if (description) {
      const formattedDescription = description.replace(/<\/?\w*>/gm, '');
      this.metaService.updateTag({ name: 'twitter:description', content: formattedDescription});
      this.metaService.updateTag({ property: 'og:description', content: formattedDescription });
    }
  }
}

