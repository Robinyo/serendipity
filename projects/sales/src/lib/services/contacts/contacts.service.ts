import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

import { Contact } from '../../models/models';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends CollectionService {

  constructor(protected httpClient: HttpClient,
              protected logger: LoggerService) {

    super(logger);
  }

  public find(): Observable<Contact[]> {

    return this.httpClient.get<Contact[]>(this.contactsUrl).pipe(
      tap(() => {
        this.logger.info('ContactsService: find() completed');
      }),
      catchError(this.handleError)
    );

  }

  public findOne(id: string): Observable<Contact> {

    return this.httpClient.get<Contact>(this.contactsUrl + id).pipe(
      tap(() => {
        this.logger.info('ContactsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

  public create(contact: Contact): Observable<HttpEvent<Contact>> {

    return this.httpClient.post<Contact>(this.contactsUrl, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: create() completed');
      }),
      catchError(this.handleError)
    );

  }

  public update(contact: Contact): Observable<HttpEvent<Contact>> {

    return this.httpClient.patch<Contact>(this.contactsUrl, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: patch() completed');
      }),
      catchError(this.handleError)
    );

  }

  public delete(id: string): Observable<Contact> {

    return this.httpClient.delete<Contact>(this.contactsUrl + id).pipe(
      tap(() => {
        this.logger.info('ContactsService: delete() completed');
      }),
      catchError(this.handleError)
    );
  }

}

// https://angular.io/guide/http#getting-error-details

// https://firebase.google.com/docs/firestore/reference/rest/

// https://www.csvjson.com/csv2json

/*

    // const sort = 'createTime';
    // const order = 'desc';
    // const params = new HttpParams().set('sort', sort).set('order', order);

    return this.httpClient.post<Contact>(endpoint, body, this.getHttpOptions(null))
    .pipe(
      tap(() => {
        this.logger.info('FormsService: submitFormData() completed');
      }),
      catchError(this.handleError('submitFormData', []))
    );

*/
