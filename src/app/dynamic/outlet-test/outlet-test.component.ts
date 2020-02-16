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
    children: [
      {
        type: 'test-blue',
      },
    ],
  },
  {
    type: 'test-orange',
    children: [
      {
        type: 'test-blue',
      },
    ],
  },
  {
    type: 'test-green',
  },
];

const config2 = [
  {
    type: 'test-blue',
    // children: [
    //   {
    //     type: 'test-orange',

    //   },
    // ],
  },
  {
    type: 'test-green',
  },
  {
    type: 'test-orange',
    // children: [
    //   {
    //     type: 'test-green',
    //   },
    // ],
  },
];