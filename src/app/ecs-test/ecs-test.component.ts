import { ChangeDetectionStrategy, Component } from '@angular/core';

import { create } from './company';

@Component({
  selector: 'app-store-test',
  templateUrl: 'ecs-test.component.html',
  styleUrls: ['ecs-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ECSTestComponent {
  constructor() {
    create();
  }
}
