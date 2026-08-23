import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withXhr, withInterceptors } from '@angular/common/http'; // 👈 Imported withInterceptors
import { provideRouter } from '@angular/router';

import { authInterceptor } from './core/interceptors/auth';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withXhr(),
      withInterceptors([authInterceptor])
    ),
    provideZonelessChangeDetection(),
    provideRouter(routes)
  ]
};

// https://angular.dev/guide/http
