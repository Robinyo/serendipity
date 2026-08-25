import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';

import { map } from 'rxjs';

import { AUTH_SERVICE_TOKEN, AuthService } from '../services/auth.js';

export const authGuard: CanActivateFn = (route, state) => {

  const auth: AuthService = inject(AUTH_SERVICE_TOKEN);

  const bffUrl = window.location.hostname === 'localhost' && window.location.port === '4200'
    ? 'https://serendipity.localhost'
    : '';

  return auth.checkSession().pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        return true;
      }

      // 🔑 THE FIX: Force a top-level window context breakout to bypass cross-origin browser locks
      if (window.top) {
        window.top.location.href = `${bffUrl}/oauth2/authorization/keycloak`;
      } else {
        window.location.href = `${bffUrl}/oauth2/authorization/keycloak`;
      }

      return false;
    })
  );

};
