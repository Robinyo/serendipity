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

/*

  serverScheme: 'http',
  serverHost: 'localhost',
  serverPort: '3001',

  public create(contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.post<HttpResponse<Contact>>(this.url, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: create() completed');
      })
    );

  }

import { HttpClient, HttpResponse, HttpHeaders, HttpParams } from '@angular/common/http';

  protected getHttpOptions(params: HttpParams | null = null): HttpOptions {

    // this.logger.info('CollectionService: getHttpOptions()');

    if (!this.httpOptions) {

      this.httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        params: null
      };

    }

    this.httpOptions.params = params;

    // this.logger.info('httpOptions: ' + JSON.stringify(this.httpOptions, null, 2));

    return this.httpOptions;
  }

*/
