import { AuthService, AuthGuard } from 'auth';

import { Auth0AuthService } from './services/auth/auth.service';
import { Auth0AuthGuard } from './guards/auth/auth.guard';

export const authProviders = [
  { provide: AuthService, useClass: Auth0AuthService },
  { provide: AuthGuard, useClass: Auth0AuthGuard }
];

