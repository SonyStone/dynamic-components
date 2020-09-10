import { ChangeDetectionStrategy, Component } from '@angular/core';
import { State1Store } from './state-1.service';

@Component({
  selector: 'app-dynamic-counter',
  templateUrl: 'dynamic-counter.component.html',
  styleUrls: ['dynamic-counter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicCounterComponent {
  constructor(
    public state1Store: State1Store,
  ) {}
}
