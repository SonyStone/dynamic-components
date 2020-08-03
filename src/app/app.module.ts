import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CONSOLE } from 'doc-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InsertVideoModule } from 'research';


@NgModule({

  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    [
      InsertVideoModule,
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
