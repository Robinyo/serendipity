import { AuthService, AuthGuard } from 'auth';

import { AuthOktaService } from './services/auth/auth-okta.service';
import { AuthOktaGuard } from './guards/auth/auth-okta.guard';

export const authProviders = [
  { provide: AuthService, useClass: AuthOktaService },
  { provide: AuthGuard, useClass: AuthOktaGuard }
];

