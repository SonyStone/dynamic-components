import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { asapScheduler, combineLatest, Subject } from 'rxjs';
import { map, startWith, subscribeOn, takeUntil } from 'rxjs/operators';

import { TocService } from '../toc.service';
import { scrollToElement } from './scroll-to-element';

@Component({
  selector: 'aio-toc',
  templateUrl: 'toc.component.html',
  styleUrls: ['toc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TocComponent implements AfterViewInit, OnDestroy {

  activeIndex: number | null = null;

  isCollapsed = true;

  private isEmbedded = false;

  @ViewChildren('tocItem') private items: QueryList<ElementRef>;
  private onDestroy = new Subject();


  constructor(
    elementRef: ElementRef,
    private tocService: TocService,
    private cd: ChangeDetectorRef,
  ) {
    this.isEmbedded = elementRef.nativeElement.className.indexOf('embedded') !== -1;
  }

  ngAfterViewInit() {

    if (!this.isEmbedded || true) {
      // We use the `asap` scheduler because updates to `activeItemIndex` are triggered by DOM changes,
      // which, in turn, are caused by the rendering that happened due to a ChangeDetection.
      // Without asap, we would be updating the model while still in a ChangeDetection handler, which is disallowed by Angular.
      combineLatest([
        this.tocService.activeItemIndex.pipe(
          subscribeOn(asapScheduler)
        ),
        this.items.changes.pipe(
          startWith(this.items),
          map((items) => items.toArray()),
        ),
      ])
          .pipe(takeUntil(this.onDestroy))
          .subscribe(([index, items]) => {
            this.activeIndex = index;
            this.cd.markForCheck();

            if (index === null || index >= items.length) {
              return;
            }

            const element = items[index].nativeElement;
            const parent = element.offsetParent;

            scrollToElement(parent, element);
          });
    }
  }



  ngOnDestroy() {
    this.onDestroy.next();
  }
}

