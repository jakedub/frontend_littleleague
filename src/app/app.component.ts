// app.component.ts
import { Component } from '@angular/core';
import { HomepageComponent } from './homepage/homepage.component';  // Import HomepageComponent

@Component({
  selector: 'app-root',
  standalone: true,  // Mark it as a standalone component
  template: `<app-homepage></app-homepage>`,  // Use HomepageComponent directly in the template
  styleUrls: ['./app.component.scss'],
  imports: [HomepageComponent],  // Include HomepageComponent in the imports
})
export class AppComponent {
  title = 'my-app';
}