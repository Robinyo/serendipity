import { Router } from '@angular/router';

import { Auth0Config } from './models/models';
import { Auth0AuthService } from './services/auth/auth.service';

import { LoggerService } from 'utils';

// AoT requires an exported function for factories
export function authServiceFactory(config: Auth0Config, router: Router, logger: LoggerService) {
  return new Auth0AuthService(config, router, logger);
}
