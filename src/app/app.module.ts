// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomepageComponent } from './homepage/homepage.component';
import { MarkerService } from './marker.service'; 
@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    HomepageComponent // Keep the routing module here if needed
  ],
  providers: [MarkerService],
  bootstrap: []  // Leave this empty since we are using bootstrapApplication in main.ts
})
export class AppModule { }