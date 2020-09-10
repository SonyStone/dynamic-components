import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'test-2',
  templateUrl: 'test-2.component.html',
  styleUrls: ['test-2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test2Component {}
