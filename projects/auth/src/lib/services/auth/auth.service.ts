import { Injectable } from '@angular/core';

import { Auth } from './auth';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Auth {

  constructor(private logger: LoggerService) {

    super();

    this.logger.info('AuthService: constructor()');
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getAccessToken(): string {
    return this.accessToken;
  }

  // TODO -> See: collection.service.ts

  public getUser() {

    return undefined;
  }

  public login() {

    return;
  }

  public logout(returnUrl: string) {

    return;
  }

}
