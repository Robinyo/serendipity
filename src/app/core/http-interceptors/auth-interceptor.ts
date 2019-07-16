import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

// import { AuthService } from 'auth';
// import { AuthOktaService } from 'auth-okta';
import { AuthOktaService } from 'auth-okta';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(// private auth: AuthService
              private auth: AuthOktaService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    const accessToken = this.auth.getAccessToken();

    if (accessToken) {
      const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + accessToken } });
      return next.handle(authReq);
    }

    return next.handle(req);
  }

}

// https://angular.io/guide/http#intercepting-requests-and-responses
