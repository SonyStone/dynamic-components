import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-empty-route',
  templateUrl: 'empty-route.component.html',
  styleUrls: ['empty-route.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyRouteComponent {}
