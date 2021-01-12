import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {ComponentsModule} from './_components/_components.module';
import {HttpClientModule} from '@angular/common/http';
import {UnauthorizedUserInterceptor} from './_interceptors/unauthorized-user.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentsModule,
    HttpClientModule,
  ],
  providers: [
    UnauthorizedUserInterceptor
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
