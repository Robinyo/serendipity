import { AuthService } from 'auth-lib';

import { BffAuthService } from './services/auth/auth.service';

export const authProviders = [

  {
    provide: AuthService,
    useClass: BffAuthService
  }

];
