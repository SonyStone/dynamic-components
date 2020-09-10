import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  EventEmitter,
  Inject,
  Injector,
  Input,
  OnDestroy,
  Optional,
  Output,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { CustomElementLoader } from 'custom-element';
import { forkJoin, Observable, pipe } from 'rxjs';
import { catchError, mapTo, switchMap, tap } from 'rxjs/operators';

import { animateProp } from './animate-prop';
import { CONSOLE } from './console.injection-token';
import { DocumentContents } from './document-contents.interface';
import { DocumentView } from './document-view';
import { TARGET_ELEMENT_PARSER, TargetElementParser } from './target-element-parser';
import { VOID } from './utils/void';

// Constants
export const NO_ANIMATIONS = 'no-animations';

@Directive({
  selector: '[docViewer]',
})
export class DocViewerDirective implements OnDestroy, TargetElementParser {
  // Enable/Disable view transition animations.
  static animationsEnabled = true;

  private hostElement: HTMLElement;

  private docContents$ = new EventEmitter<DocumentContents>();

  protected currViewContainer: HTMLElement = this.renderer.createElement('div');

  private view = new DocumentView()
    .set(this.renderer.createElement('div'));

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
      tap((newDoc) => {
        this.view.update(newDoc);
      }),
      switchMap(() => this.render(this.view)),
    )
    .subscribe();

  constructor(
    elementRef: ElementRef,
    private renderer: Renderer2,
    private elementLoader: CustomElementLoader,
    private injector: Injector,
    @Inject(CONSOLE) private console: Console,
    @Optional() @Inject(TARGET_ELEMENT_PARSER) private parsers: TargetElementParser[] | undefined,
    @Inject(PLATFORM_ID) private platformId: string
  ) {
    this.hostElement = elementRef.nativeElement;
    this.hostElement = this.renderer.parentNode(this.hostElement);

    // Security: the initialDocViewerContent comes from the prerendered DOM and is considered to be secure
    this.hostElement.innerHTML = '';

    if (this.hostElement.firstElementChild) {
      this.currViewContainer = this.hostElement.firstElementChild as HTMLElement;
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.dispose();
  }

  prepare(container: DocumentView): Observable<void> {
    return this.parsers
      ? forkJoin(this.parsers?.map(parser => parser.prepare(container)))
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
  protected render(container: DocumentView): Observable<void> {
    return VOID.pipe(
      // Security: `doc.contents` is always authored by the documentation team
      //           and is considered to be safe.
      switchMap(() => this.prepare(container)),
      switchMap(() => this.elementLoader.loadContainedCustomElements(container.container, this.injector)),
      tap(() => this.docReady.emit()),
      switchMap(() => this.swapViews()),
      tap(() => this.docRendered.emit()),
      catchError(err => {
        const errorMessage = (err instanceof Error) ? err.stack : err;
        this.console.error(new Error(`[DocViewer] Error preparing document '${container.id}': ${errorMessage}`));

        this.view.reset();
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

    const animationsEnabled =
      DocViewerDirective.animationsEnabled
      && !this.hostElement.classList.contains(NO_ANIMATIONS)
      && isPlatformBrowser(this.platformId);

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
        this.renderer.appendChild(this.hostElement, this.view.container);
      }),
      // tap(() => this.hostElement.appendChild(this.nextViewContainer)),
      // tap(() => this.execute()),
      switchMap(() => this.execute()),
      tap(() => this.docInserted.emit()),
      animationsEnabled ? switchMap(() => animateEnter(this.view.container)) : pipe(),
      // Update the view references and clean up unused nodes.
      tap(() => {
        this.currViewContainer = this.view.swap(this.currViewContainer);
        this.view.reset(); // Empty to release memory.
      }),
    );
  }
}
