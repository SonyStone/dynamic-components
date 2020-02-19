import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { configs } from '../test-configs';

@Component({
  selector: 'ngx-outlet-test',
  templateUrl: 'ngx-outlet-test.component.html',
  styleUrls: ['ngx-outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxOutletTestComponent {

  configs = configs;

  sectionConfig: any = this.configs[0];

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  toggle(config: any): void {
    this.sectionConfig = config;

    this.cd.markForCheck();
  }
}
