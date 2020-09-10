import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-store-paginator',
  templateUrl: 'store-paginator.component.html',
  styleUrls: ['store-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePaginatorComponent {

  log(obj: unknown) {
    console.log(`log:`, obj);
  }
}
