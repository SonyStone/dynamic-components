import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';


@NgModule({

  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  declarations: [
    HelloComponent,
    AppComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
