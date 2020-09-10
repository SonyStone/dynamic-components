import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropdownModule } from '@factory/utils';
import { CONSOLE } from 'doc-viewer';
import { InsertVideoModule } from 'research';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


@NgModule({

  imports: [
    [
      BrowserModule.withServerTransition({ appId: 'serverApp' }),
      AppRoutingModule,
      BrowserAnimationsModule
    ],
    [
      InsertVideoModule,
      DropdownModule,
    ],
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: CONSOLE, useValue: console, },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
