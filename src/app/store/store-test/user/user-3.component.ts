import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { StoreModule } from 'store';

import { userTypeProviders } from '../user-type';

@Component({
  selector: 'user-3',
  template: `

  <span>(Component) user-3</span>

  <ng-container *getData="let userType from 'user-type';
                          let next = next">

    <pre>userType: {{ userType }}</pre>

    <button (click)="next()">next user</button>

    <ng-container>
      <pre>user: {{ (userType | getData)?.user }}</pre>

    </ng-container>

  </ng-container>
  `,
  styles: [`
    :host {
      background-color: khaki;
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
export class User3Component {}

@NgModule({
  imports: [
    StoreModule,
    CommonModule,
  ],
  declarations: [
    User3Component,
  ],
  exports: [
    User3Component,
  ],
})
export class User3Module { }
