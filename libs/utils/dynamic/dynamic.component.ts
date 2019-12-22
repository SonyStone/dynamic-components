import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OuteltConfig } from '../component-outlet';

@Component({
  selector: 'app-dynamic',
  template: `
  <app-component-outlet [configs]="configs | component: context"></app-component-outlet>
  `,
  styles: [`
    :host {
      display: block;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DynamicComponent {
  @Input() configs: OuteltConfig[];
  @Input() context: any[];

  constructor() {  }
}
