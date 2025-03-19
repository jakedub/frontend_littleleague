import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <router-outlet></router-outlet> <!-- This will render the active route -->
  `,
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, MatSlideToggleModule], // Import RouterOutlet to handle routing
})
export class AppComponent {
  title = 'Front End';
}