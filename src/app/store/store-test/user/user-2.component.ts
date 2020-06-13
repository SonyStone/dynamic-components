import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, Injector } from '@angular/core';
import { StoreModule } from 'store';

import { userTypeProviders } from '../user-type';

@Component({
  selector: 'user-2',
  template: `

  <span>(Component) user-2</span>

  <ng-container *getData="let userType from 'user-type';
                          let next = next;">

  <pre>userType: {{ userType }}</pre>

    <button (click)="next()">next user</button>

    <ng-container *ngIf="(userType | getData) as user">
      <pre>user: {{ user.user }}</pre>

      <button *ngIf="user.rename as rename"
              (click)="rename('papa')">rename</button>

      <button *ngIf="user.reset as reset"
              (click)="reset()">reset</button>

      <button *ngIf="user.clear as clear"
              (click)="clear()">clear</button>

    </ng-container>
  </ng-container>
  `,
  styles: [`
    :host {
      background-color: aquamarine;
      display: block;
      margin: 1rem;
      padding: 1rem;
      overflow: hidden;
      border: 1px solid #fff;
      height: 150px;
    }
  `],
  providers: [
    userTypeProviders,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User2Component {}

@NgModule({
  imports: [
    StoreModule,
    CommonModule,
  ],
  declarations: [
    User2Component,
  ],
  exports: [
    User2Component,
  ],
})
export class User2Module {
  constructor(
    private injector: Injector,
  ) {
    // console.log(injector);

    // injector.
  }
}
