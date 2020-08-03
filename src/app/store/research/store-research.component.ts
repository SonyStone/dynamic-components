import { ChangeDetectionStrategy, Component, OnDestroy, ViewRef } from '@angular/core';
import { BeforeDestroyService, BeforeOnDestroy } from 'research';
import { Subscription, timer } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-store-research',
  templateUrl: 'store-research.component.html',
  styleUrls: ['store-research.component.scss'],
  providers: [
    BeforeDestroyService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreResearchComponent implements BeforeOnDestroy, OnDestroy {

  viewRef: ViewRef | undefined;

  subscription = new Subscription();

  constructor(
    private beforeDestroyService: BeforeDestroyService,
  ) {

    this.subscription.add(
      this.beforeDestroyService.beforeDestroy.subscribe(() => {
        console.log(`old beforeDestroy`)
      })
    )
  }

  ngxBeforeOnDestroy() {
    console.log('1. BEFORE ONDESTROY INVOKE METHOD (await 2 sec)');
    return new Promise((resolve) => {
      setTimeout(() => this.heavyFunction(resolve), 2000);
    });
  }

  @BeforeOnDestroy
  ngOnDestroy(): void {
    console.log('3. COMPONENT REMOVED AFTER 5 SECONDS OF EXPECTATION');


    this.subscription.unsubscribe();
  }

  private heavyFunction(resolve) {
    console.log('2. EXECUTE HEAVY FUNCTION (3 sec)');

    const sourcef = timer(3000)
    .pipe(take(1))
    .subscribe(() => {
      resolve();
    });
  }
}
