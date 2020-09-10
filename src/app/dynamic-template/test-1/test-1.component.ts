import { ChangeDetectionStrategy, Component } from '@angular/core';

import { provideComponentAccessor } from '../lib/portal-content.directive';

@Component({
  selector: 'test-1',
  templateUrl: 'test-1.component.html',
  styleUrls: ['test-1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentAccessor(Test1Component),
  ],
})
export class Test1Component {}
