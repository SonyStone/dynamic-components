import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { configs } from '../test-configs';

@Component({
  selector: 'outlet-test',
  templateUrl: 'outlet-test.component.html',
  styleUrls: ['outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletTestComponent {

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
