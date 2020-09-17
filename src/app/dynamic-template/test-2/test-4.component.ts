import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideComponentAccessor } from 'dynamic';

@Component({
  selector: 'test-4',
  templateUrl: 'test-4.component.html',
  styleUrls: ['test-4.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideComponentAccessor(Test4Component),
  ],
})
export class Test4Component {}
