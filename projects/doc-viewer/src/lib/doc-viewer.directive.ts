import { Directive, ElementRef, EventEmitter, Inject, Input, OnDestroy, Optional, Output, Renderer2 } from '@angular/core';
import { WebComponentLoader } from 'dynamic';
import { forkJoin, Observable, pipe, throwError } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';

import { animateProp } from './animate-prop';
import { CONSOLE } from './console';
import { DocumentContents } from './document-contents.interface';
import { TARGET_ELEMENT_PARSER, TargetElementParser } from './target-element-parser';
import { VOID } from './utils/void';

// Constants
export const NO_ANIMATIONS = 'no-animations';

// Initialization prevents flicker once pre-rendering is on
const initialDocViewerElement = document.querySelector('aio-doc-viewer');
const initialDocViewerContent = initialDocViewerElement ? initialDocViewerElement.innerHTML : '';

@Directive({
  selector: '[docViewer]',
})
export class DocViewerDirective implements OnDestroy, TargetElementParser {
  // Enable/Disable view transition animations.
  static animationsEnabled = true;

  private hostElement: HTMLElement;

  private docContents$ = new EventEmitter<DocumentContents>();

  protected currViewContainer: HTMLElement = this.renderer.createElement('div');
  protected nextViewContainer: HTMLElement = this.renderer.createElement('div');

  @Input()
  set doc(newDoc: DocumentContents) {
    // Ignore `undefined` values that could happen if the host component
    // does not initially specify a value for the `doc` input.
    if (newDoc) {
      this.docContents$.emit(newDoc);
    }
  }

  // The new document is ready to be inserted into the viewer.
  // (Embedded components have been loaded and instantiated, if necessary.)
  @Output() docReady = new EventEmitter<void>();

  // The previous document has been removed from the viewer.
  // (The leaving animation (if any) has been completed and the node has been removed from the DOM.)
  @Output() docRemoved = new EventEmitter<void>();

  // The new document has been inserted into the viewer.
  // (The node has been inserted into the DOM, but the entering animation may still be in progress.)
  @Output() docInserted = new EventEmitter<void>();

  // The new document has been fully rendered into the viewer.
  // (The entering animation has been completed.)
  @Output() docRendered = new EventEmitter<void>();

  private subscription = this.docContents$
    .pipe(
      switchMap(newDoc => this.render(newDoc)),
    )
    .subscribe();

  constructor(
    elementRef: ElementRef,
    @Inject(CONSOLE) private console: Console,
    private componentLoader: WebComponentLoader,
    private renderer: Renderer2,
    @Optional() @Inject(TARGET_ELEMENT_PARSER) private parsers: TargetElementParser[] | undefined,
  ) {
    this.hostElement = elementRef.nativeElement;
    this.hostElement = this.renderer.parentNode(this.hostElement);

    // Security: the initialDocViewerContent comes from the prerendered DOM and is considered to be secure
    this.hostElement.innerHTML = initialDocViewerContent;

    if (this.hostElement.firstElementChild) {
      this.currViewContainer = this.hostElement.firstElementChild as HTMLElement;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dispose();
  }

  prepare(targetElem: HTMLElement, docId: string): Observable<void> {
    return this.parsers
      ? forkJoin(this.parsers?.map(parser => parser.prepare(targetElem, docId)))
          .pipe(mapTo(undefined))
      : VOID;
  }

  execute(): Observable<void> {
    return this.parsers
    ? forkJoin(this.parsers?.map(parser => parser.execute()))
        .pipe(mapTo(undefined))
    : VOID;
  }


  dispose(): void {
    this.parsers?.forEach((parser) => parser.dispose());
  }

  onError(err): void {
    this.parsers?.forEach((parser) => parser.onError(err));
  }

  /**
   * Add doc content to host element and build it out with embedded components.
   */
  protected render(doc: DocumentContents): Observable<void> {

    // this.robotsService.setNoIndex(doc.id === DOCUMENT_ID.FILE_NOT_FOUND || doc.id === DOCUMENT_ID.FETCHING_ERROR);

    return VOID.pipe(
        // Security: `doc.contents` is always authored by the documentation team
        //           and is considered to be safe.
        tap(() => this.nextViewContainer.innerHTML = doc.contents || ''),
        // tap(() => this.prepare(this.nextViewContainer, doc.id)),
        switchMap(() => Math.random() > 0.8 ? throwError('asdasd') : VOID),
        switchMap(() => this.prepare(this.nextViewContainer, doc.id)),
        switchMap(() => this.componentLoader.loadContainedCustomElements(this.nextViewContainer)),
        tap(() => this.docReady.emit()),
        switchMap(() => this.swapViews()),
        tap(() => this.docRendered.emit()),
        catchError(err => {
          const errorMessage = (err instanceof Error) ? err.stack : err;
          this.console.error(new Error(`[DocViewer] Error preparing document '${doc.id}': ${errorMessage}`));
          this.nextViewContainer.innerHTML = '';
          this.onError(err);

          return VOID;
        }),
    );
  }

  /**
   * Swap the views, removing `currViewContainer` and inserting `nextViewContainer`.
   * (At this point all content should be ready, including having loaded and instantiated embedded
   *  components.)
   *
   * Optionally, run a callback as soon as `nextViewContainer` has been inserted, but before the
   * entering animation has been completed. This is useful for work that needs to be done as soon as
   * the element has been attached to the DOM.
   */
  protected swapViews(): Observable<void> {

    const animationsEnabled = DocViewerDirective.animationsEnabled && !this.hostElement.classList.contains(NO_ANIMATIONS);

    const animateLeave = (elem: HTMLElement) => animateProp(elem, 'opacity', '1', '0.1');
    const animateEnter = (elem: HTMLElement) => animateProp(elem, 'opacity', '0.1', '1');

    let done$ = VOID;

    if (this.currViewContainer.parentElement) {
      done$ = done$.pipe(
        // Remove the current view from the viewer.
        animationsEnabled ? switchMap(() => animateLeave(this.currViewContainer)) : pipe(),
        tap(() => this.currViewContainer.parentElement.removeChild(this.currViewContainer)),
        tap(() => this.docRemoved.emit()),
      );
    }

    return done$.pipe(
      // Insert the next view into the viewer.
      tap(() => {
        this.renderer.appendChild(this.hostElement, this.nextViewContainer);
      }),
      // tap(() => this.hostElement.appendChild(this.nextViewContainer)),
      // tap(() => this.execute()),
      switchMap(() => this.execute()),
      tap(() => this.docInserted.emit()),
      animationsEnabled ? switchMap(() => animateEnter(this.nextViewContainer)) : pipe(),
      // Update the view references and clean up unused nodes.
      tap(() => {
        const prevViewContainer = this.currViewContainer;
        this.currViewContainer = this.nextViewContainer;
        this.nextViewContainer = prevViewContainer;
        this.nextViewContainer.innerHTML = '';  // Empty to release memory.
      }),
    );
  }
}
