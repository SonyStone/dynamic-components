import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { userTypeProviders } from '../user-type';

@Component({
  selector: 'user-1',
  template: `

  <span>(Component) user-1</span>

  <ng-container *getData="let userType from 'user-type';
                          let next = next;">

    <pre>userType: {{ userType }}</pre>

    <button (click)="next()">next user</button>

    <ng-container *getData="let user from userType;
                            let rename = rename;
                            let buttons = buttons;
                            let reset = reset;">

      <pre>user: {{ user }}</pre>

      <button *ngIf="rename"
              (click)="rename('papa')">{{ buttons.rename }}</button>

      <button *ngIf="reset"
              (click)="reset()">{{ buttons.reset }}</button>

    </ng-container>
  </ng-container>
  `,
  styles: [`
    :host {
      background-color: orange;
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
export class User1Component {}

@NgModule({
  imports: [
    CommonModule,
    StoreModule,
  ],
  declarations: [
    User1Component,
  ],
  exports: [
    User1Component,
  ],
})
export class User1Module { }
