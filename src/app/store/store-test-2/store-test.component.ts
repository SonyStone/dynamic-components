import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-store-test',
  templateUrl: 'store-test.component.html',
  styleUrls: ['store-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreTestComponent {}
