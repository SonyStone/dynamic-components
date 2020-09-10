import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

import { UserAdminContext, userAdminProviders } from '../user-admin';


@Component({
  template: `<ng-content></ng-content>`,
  styles: [`
    :host {
      background-color: red;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapperComponent {}

@NgModule({
  declarations: [
    WrapperComponent,
  ],
  providers: [
    userAdminProviders,
  ],
})
export class TestData1Module {
  type = UserAdminContext;
  component = WrapperComponent;
}
