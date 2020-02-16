import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

@Component({
  selector: 'outlet-test',
  templateUrl: 'outlet-test.component.html',
  styleUrls: ['outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletTestComponent {

  sectionConfig: any = config1;

  private alternativeSectionConfig = config2;

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  toggle(): void {
    const temp = this.sectionConfig;
    this.sectionConfig = this.alternativeSectionConfig;
    this.alternativeSectionConfig = temp;

    this.cd.markForCheck();
  }
}

const config1 = [
  {
    type: 'test-orange',
    lable: 1,
    children: [
      [
        {
          type: 'test-blue',
          lable: 2,
        },
        {
          type: 'test-green',
          lable: 3,
        },
      ],
    ],
  },
  {
    type: 'test-orange',
    lable: 4,
    children: [
      [
        {
          type: 'test-green',
          lable: 5,
        },
        {
          type: 'test-blue',
          lable: 6,
        },
      ],
    ],
  },
  {
    type: 'test-blue',
    lable: 7,
  },
  {
    type: 'test-green',
    lable: 8,
  },
];

const config2 = [
  // {
  //   type: 'test-blue',
  //   children: [
  //     { type: 'test-orange' },
  //   ],
  // },
  // {
  //   type: 'test-green',
  // },
  // {
  //   type: 'test-orange',
  //   children: [
  //     [
  //       {
  //         type: 'test-green',
  //       },
  //     ],
  //   ],
  // },
];