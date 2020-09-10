import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-view',
  templateUrl: 'view.component.html',
  styleUrls: ['view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {}
