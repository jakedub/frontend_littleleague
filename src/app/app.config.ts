// app.config.ts
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';  // If using routing, import routes

export const appConfig = [
  provideHttpClient(),  // Add the HTTP client to the configuration
  provideRouter(routes), // Add routing to the config
  // Add any other necessary providers
];