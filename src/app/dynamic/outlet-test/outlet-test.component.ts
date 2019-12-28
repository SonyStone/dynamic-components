import { ChangeDetectionStrategy, Component, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'outlet-test',
  templateUrl: 'outlet-test.component.html',
  styleUrls: ['outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletTestComponent {

  sectionConfig = [
    {
      type: 'test-2',
    },
    {
      type: 'test-1',
      children: [
        {
          type: 'test-3',
        },
        {
          type: 'test-3',
        }
      ]
    }
  ];

  constructor(
    private cd: ChangeDetectorRef,
  ) {

  }

  toggle(): void {
    this.sectionConfig = [
      ...this.sectionConfig,
      {
        type: 'test-1',
      }
    ];

    this.cd.markForCheck();
  }
}
