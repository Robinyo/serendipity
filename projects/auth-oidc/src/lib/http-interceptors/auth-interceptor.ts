import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { AuthService } from 'auth';

import { LoggerService } from 'utils';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService,
              private logger: LoggerService) {

    this.logger.info('AuthInterceptor: constructor()');
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const accessToken = this.authService.getAccessToken();

    if (accessToken) {

      // this.logger.info('AuthInterceptor: intercept() Bearer ' + accessToken);

      const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken } });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

}

// https://angular.io/guide/http#intercepting-requests-and-responses
