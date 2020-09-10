import { Directive, Injectable, OnDestroy } from '@angular/core';
import { ViewContextHandler } from 'store';

import { ScrollService } from '../scroll.service';
import { TocItem, TocService } from '../toc.service';
import { count } from './count';

type TocType = 'None' | 'Floating' | 'EmbeddedSimple' | 'EmbeddedExpandable';

@Injectable()
export class TocContext {
  tocList: TocItem[] = [];
  $implicit: TocItem[] = this.tocList;
  type: TocType = 'None';

  private isEmbedded = false;
  primaryMax = 4;

  isCollapsed = true;

  constructor(
    private scrollService: ScrollService,
  ) {}

  toggle = (canScroll = true) => {
    this.isCollapsed = !this.isCollapsed;
    if (canScroll && this.isCollapsed) {
      this.toTop();
    }
  }

  toTop = () => {
    this.scrollService.scrollToTop();
  }

  update(tocList: TocItem[]): void {
    this.$implicit = this.tocList = tocList;
    const itemCount = count(this.tocList, item => item.level !== 'h1');

    this.type = (itemCount > 0)
      ? (this.isEmbedded)
        ? (itemCount > this.primaryMax)
          ? 'EmbeddedExpandable'
          : 'EmbeddedSimple'
        : 'Floating'
      : 'None';
  }
}


@Directive({
  selector: '[toc]',
  providers: [
    ViewContextHandler,
    TocContext,
  ]
})
export class TocDirective implements OnDestroy {

  private subscription = this.tocService.tocList
    .subscribe((tocList) => {
      this.context.update(tocList);
      this.viewContextHandler.update(this.context);
    });

  constructor(
    private viewContextHandler: ViewContextHandler<TocContext>,
    private tocService: TocService,
    private context: TocContext,
  ) { }

  ngOnDestroy(): void {
    this.viewContextHandler.clear();
    this.subscription.unsubscribe();
  }
}