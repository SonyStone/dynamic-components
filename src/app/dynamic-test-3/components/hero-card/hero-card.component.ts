import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-hero-card',
  templateUrl: 'hero-card.component.html',
  styleUrls: ['hero-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroCardComponent {}
