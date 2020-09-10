import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dynamic-test',
  templateUrl: 'dynamic-test.component.html',
  styleUrls: ['dynamic-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicTestComponent {}
