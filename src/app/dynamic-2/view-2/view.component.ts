import { ChangeDetectionStrategy, Component } from '@angular/core';
import template from 'raw-loader!./template.html';

@Component({
  selector: 'app-view',
  templateUrl: 'view.component.html',
  styleUrls: ['view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewComponent {

  currentDocument = {
    id: 'test-1',
    contents: template,
  };

}
