import { ChangeDetectionStrategy, Component } from '@angular/core';

const template = `
  <h1>test1</h1>
  <app-test-2></app-test-2>
  <p>qwe asd zxc</p>
  <app-test-1>
    <app-test-1></app-test-1>
    <app-test-1></app-test-1>
  </app-test-1>
`;

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

  constructor() { }
}
