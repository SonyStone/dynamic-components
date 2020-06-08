import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { userTypeProviders } from '../user-type';

@Component({
  selector: 'user-2',
  template: `

  <ng-container *getData="let userType from 'user-type'; let next = next">

  <pre>userType: {{ userType }}</pre>

    <button (click)="next()">next user</button>

    <ng-container *ngIf="(userType | getData) as user">
      <pre>user: {{ user.user }}</pre>

      <button *ngIf="user.rename"
              (click)="user.rename('papa')">rename</button>

      <button *ngIf="user.reset"
              (click)="user.reset()">reset</button>

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
export class User2Module { }
