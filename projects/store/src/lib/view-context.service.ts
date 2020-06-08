import { EmbeddedViewRef, Injectable, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';

export abstract class AbstractContext<T> {

  $implicit: any;

  private viewContexts = new Set<Updatetable<T>>();

  set(viewContext: Updatetable<T>): void {
    this.viewContexts.add(viewContext);

    this._update();
  }

  remove(viewContext: Updatetable<T>): void {
    this.viewContexts.delete(viewContext);

    this._update();
  }

  _update(): this {
    this.viewContexts.forEach((view) => view.update(this));


    return this;
  }
}

export interface Updatetable<T> {
  update(conetxt: AbstractContext<T>): void
}

@Injectable()
export class ViewContextHandler<C> implements OnDestroy, Updatetable<C> {

  private viewRef: EmbeddedViewRef<AbstractContext<C>> | undefined;

  private context: AbstractContext<C>;

  constructor(
    private templateRef: TemplateRef<AbstractContext<C>>,
    private viewContainer: ViewContainerRef,
  ) {}

  ngOnDestroy(): void {
    this.clear();
  }

  update(context: AbstractContext<C>): this {

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
