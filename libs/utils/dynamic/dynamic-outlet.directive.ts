import { ChangeDetectorRef, Directive, Input, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from '@angular/core';

import { ComponentCacheService } from './component-cache.service';
import { ComponentCreaterService } from './component-creater.service';
import { IterableChangeRecord, IterableDiffer } from './differs';
import { IterableDiffers } from './iterable-differs.service';


@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[dynamic-outlet]',
  providers: [
    ComponentCreaterService,
    ComponentCacheService,
  ],
})
export class DynamicOutletDirective implements OnChanges, OnDestroy {

  @Input('dynamic-outlet') outeltConfigs: any[];

  private differ: IterableDiffer<any>|null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentCreaterService: ComponentCreaterService,
    private differs: IterableDiffers,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    // fix for Ivy JIT compiler
    this.componentCreaterService.changeDetectorRef = this.changeDetectorRef;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.outeltConfigs) {
      // this.destroyAdapterRef();

      if (!this.outeltConfigs || !Array.isArray(this.outeltConfigs) || this.outeltConfigs.length === 0) {
        return;
      }

      // console.log(`:: outeltConfigs -->`, this.outeltConfigs)

      /** ngFor part */
      {
        if (!this.differ) {
          this.differ = this.differs.find(this.outeltConfigs).create((_: number, item: any) => item.id || item);
        }

        if (this.differ) {
          const iterableChanges = this.differ.diff(this.outeltConfigs);

          // console.log(`iterableChanges`, iterableChanges, this.outeltConfigs);

          iterableChanges.forEachOperation((
            item: IterableChangeRecord<any>,
            adjustedPreviousIndex: number | null,
            currentIndex: number | null) => {
              if (item.previousIndex == null) {
                const index = (currentIndex === null)
                  ? undefined
                  : currentIndex;

                this.componentCreaterService.createComponent(item.item, index);

              } else if (currentIndex == null) {
                const index = (adjustedPreviousIndex === null)
                  ? undefined
                  : adjustedPreviousIndex;

                this.componentCreaterService.removeComponent(index);

              } else if (adjustedPreviousIndex !== null) {

                this.componentCreaterService.moveComponent(adjustedPreviousIndex, currentIndex);
              }
            })
        }
      }
    }
  }

  ngOnDestroy() {
    this.viewContainerRef.clear();
  }
}
