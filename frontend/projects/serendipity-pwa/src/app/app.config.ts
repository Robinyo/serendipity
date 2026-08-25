import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { firstValueFrom } from 'rxjs';

import { AUTH_SERVICE_TOKEN, AuthService } from 'serendipity-auth-lib';
import { APP_ENVIRONMENT } from 'serendipity-utils-lib';

import { authInterceptor } from './core/interceptors/auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Wrap the initialization logic in an arrow function so it runs in the proper DI context
    provideAppInitializer(() => {
      const authService: AuthService = inject(AUTH_SERVICE_TOKEN);
      return firstValueFrom(authService.checkSession()).catch(() => {
        // Safe catch: Guard will handle redirection if session fails
      });
    }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideZonelessChangeDetection(),
    provideRouter(routes),

    { provide: APP_ENVIRONMENT, useValue: environment },
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService }
  ]
};
