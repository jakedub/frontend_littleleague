// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,  // Keep the routing module here if needed
  ],
  providers: [],
  bootstrap: []  // Leave this empty since we are using bootstrapApplication in main.ts
})
export class AppModule { }