import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-name',
  templateUrl: 'hero-name.component.html',
  styleUrls: ['hero-name.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroNameComponent {}
