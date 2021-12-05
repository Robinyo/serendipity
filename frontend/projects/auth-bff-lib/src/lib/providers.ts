import { AuthGuard, AuthService } from 'auth-lib';

import { BffAuthGuard } from './guards/auth/auth.guard';
import { BffAuthService } from './services/auth/auth.service';

export const authProviders = [

  {
    provide: AuthGuard,
    useClass: BffAuthGuard
  },
  {
    provide: AuthService,
    useClass: BffAuthService
  }

];
