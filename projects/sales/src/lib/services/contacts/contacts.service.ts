import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { LoggerService } from 'utils';
import { ContactAdapter } from '../../adapters/contact.adapter';

import { Contact } from '../../models/contact';

import { CollectionService } from '../abstract/collection/collection.service';

const HTTP_SERVER_ERROR_CONNECTION_REFUSED = 'Connection refused';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends CollectionService {

  constructor(private httpClient: HttpClient,
              private adapter: ContactAdapter,
              protected logger: LoggerService) {

    super(logger);

    this.url = 'http://localhost:3001/api/individuals/';
  }

  public find(offset: number = 0, limit: number = 100, filter: string = ''): Observable<any> {

    this.logger.info('ContactsService: find()');

    let filterParam = '';

    if (filter.length) {
      filterParam = '&name=' + filter;
    }

    // ?page=0&size=10&name=F&sort=familyName&familyName.dir=asc
    // const queryParams = '?page=' + offset + '&size=' + limit + filterParam + '&sort=familyName&familyName.dir=asc';
    // const queryParams = '?page=' + offset + '&size=' + limit;
    const queryParams = '?page=' + offset + '&size=' + limit + '&sort=sort&sort.dir=asc';

    this.logger.info('ContactsService queryParams: ' + queryParams);

    return this.httpClient.get(this.url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');

        this.logger.info('ContactsService: find() completed');

      }),
      catchError(error => {

        this.logger.info('ContactsService: find() -> catchError()');

        if (error === undefined) {

          error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
          throw error;

        } else {

          return this.handleError('Find', []);
          // return throwError(error);
        }

      })

    );

  }

  protected handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      this.logger.info('ContactsService: handleError()');

      // TODO: send the error to your remote logging infrastructure e.g., Sentry

      // TODO: better job of transforming error for user consumption
      this.logger.error(operation + ' failed: ' + error.message);

      // Let the app keep running by returning an empty result (i.e., [])
      return of(result as T);
    };
  }

  /*

  protected handleError(error: HttpErrorResponse) {

    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);

    } else {

      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }

    // return an observable with a user-facing error message
    return throwError('Something bad happened; please try again later.');

  }

  */

  public findOne(id: string): Observable<Contact> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('ContactsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

  public create(contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.post<HttpResponse<Contact>>(this.url, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: create() completed');
      }),
      catchError(this.handleError)
    );

  }

  public update(id: string, contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.patch<HttpResponse<Contact>>(this.url + id, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: update() completed');
      }),
      catchError(this.handleError)
    );

  }

  public delete(id: string): Observable<Contact> {

    return this.httpClient.delete<Contact>(this.url + id).pipe(
      tap(() => {
        this.logger.info('ContactsService: delete() completed');
      }),
      catchError(this.handleError)
    );
  }

}

/*

  public checkPhotoUrl(url: string): Promise<string> {

    return new Promise<string>((resolve, reject) => {

      this.httpClient.get('http://localhost:3001/' + url).toPromise().then(success => {
        resolve(url);
      }, error => {
        reject('assets/images/photos/male-avatar.svg');
      });

    });

  }

  public findOne(id: string): Observable<Contact> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('ContactsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

*/

// https://docs.spring.io/spring-data/rest/docs/current/reference/html/#paging-and-sorting

// https://angular.io/guide/http#reading-the-full-response

// https://angular.io/guide/http#getting-error-details

/*

  // public find(): Observable<Contact[]> {

  // path, operator, value
  // e.g., familyName, =, B%
  // [familyName]=B%

  public find(offset: number = 0, limit: number = 100, value: string = ''): Observable<any> {

    this.logger.info('ContactsService: find()');

    let filterParam = '';

    if (value.length) {
      filterParam = '&filter[familyName]=' + value + '%';
    }

    // const queryParams = '?offset=' + offset + '&limit=' + limit + filterParam;
    // page=0&size=2&sort=name,asc
    // &sort=familyName&familyName.dir=asc
    // const queryParams = '?page=' + 0 + '&size=' + 10 + '&sort=familyName&familyName.dir=asc';
    // const queryParams = '?page=' + 0 + '&size=' + 10 + '&sort=familyName,asc';

    // nameStartsWith?name=K&sort=name&name.dir=desc
    const queryParams = '?page=' + 0 + '&size=' + 10 + '&sort=familyName&familyName.dir=asc';

    this.logger.info('ContactsService queryParams: ' + queryParams);

    return this.httpClient.get(this.url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');

        this.logger.info('ContactsService: find() completed');

      }),
      catchError(error => {

        this.logger.info('ContactsService: find() -> catchError()');

        if (error === undefined) {

          error = new Error(HTTP_SERVER_ERROR_CONNECTION_REFUSED);
          throw error;

        } else {

          return this.handleError('Find', []);
          // return throwError(error);
        }

      })

    );

  }

*/

/*

      // map((data: any[]) => data.map(item => this.adapter.adapt(item))),
      // map((response: any) => response.body.data.map(item => this.adapter.adapt(item))),

*/
