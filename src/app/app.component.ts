import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <router-outlet></router-outlet> <!-- This will render the active route -->
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet], // Import RouterOutlet to handle routing
})
export class AppComponent {
  title = 'Front End';
}