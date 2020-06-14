import { ChangeDetectionStrategy, Component } from '@angular/core';

import { TestComponentsContext } from './test-components';
import { TestDataContext } from './test-data';

@Component({
  selector: 'app-dynamic-test',
  templateUrl: 'dynamic-test.component.html',
  styleUrls: ['dynamic-test.component.scss'],
  providers: [
    TestDataContext,
    TestComponentsContext,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTestComponent {}
