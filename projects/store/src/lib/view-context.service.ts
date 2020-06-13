import { EmbeddedViewRef, Injectable, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

import { Updatetable } from './abstract.context';


@Injectable()
export class ViewContextHandler<C> implements OnDestroy, Updatetable<C> {

  private viewRef: EmbeddedViewRef<C> | undefined;

  private context: C;

  constructor(
    private templateRef: TemplateRef<C>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnDestroy(): void {
    this.clear();
  }

  update(context: C): this {

    if (!context) {
      this.clear();

      return this;
    }

    if (!this.context) {
      this.context = context;
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);

      this.viewRef.markForCheck();

      return this;
    }

    if (this.context === context) {
      this.viewRef.markForCheck();

      return this;
    }

    if (this.context !== context) {
      this.viewRef.destroy();
      this.context = context;
      this.viewRef = this.viewContainer.createEmbeddedView(this.templateRef, this.context);
      this.viewRef.markForCheck();

      return this;
    }

    throw Error(`Programming error: unknown context error, context: ${context}`);
  }

  clear(): void {
    this.context = undefined;
    this.viewContainer.clear();
    if (this.viewRef) {
      this.viewRef.destroy();
      this.viewRef = undefined;
    }
  }
}
