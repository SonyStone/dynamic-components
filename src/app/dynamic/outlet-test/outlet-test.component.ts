import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'outlet-test',
  templateUrl: 'outlet-test.component.html',
  styleUrls: ['outlet-test.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OutletTestComponent {

  sectionConfig = [
    {
      type: 'test-1',
    },
    {
      type: 'test-1',
    }
  ];
}
