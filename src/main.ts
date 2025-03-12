import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  
import { appConfig } from './app/app.config';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';

bootstrapApplication(AppComponent, {
  providers: [
    ...appConfig,  // Spread appConfig to include provideHttpClient()
    provideRouter(routes),  // Keep routing configuration
  ],
}).catch(err => console.error(err));