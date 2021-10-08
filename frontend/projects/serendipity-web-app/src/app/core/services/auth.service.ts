import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoggerService } from 'utils-lib';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  protected httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  protected urlPrefix: string = 'http' + '://' + 'localhost' +  ':' + '8080';
  protected url: string = '';

  constructor(private httpClient: HttpClient,
              private logger: LoggerService) {}

  public login(): Observable<any> {

    this.logger.info('AuthService: login()');

    this.url = this.urlPrefix + '/login';

    return this.httpClient.post(this.url, {}, this.httpOptions).pipe(
      tap(() => {
        this.logger.info('AuthService: login() completed');
      })
    );

  }

}
