import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'test-3',
  templateUrl: 'test-3.component.html',
  styleUrls: ['test-3.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Test3Component {}
