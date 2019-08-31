import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection.service';

import { Contact } from '../../models/contact';
import { ContactAdapter } from '../../adapters/contact.adapter';

import { LoggerService } from 'utils';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends CollectionService {

  constructor(private httpClient: HttpClient,
              private adapter: ContactAdapter,
              protected logger: LoggerService) {

    super(logger);
  }

  public find(): Observable<Contact[]> {

    return this.httpClient.get(this.contactsUrl).pipe(
      map((data: any[]) => data.map(item => this.adapter.adapt(item))),
      tap(() => {
        this.logger.info('ContactsService: find() completed');
      }),
      catchError(this.handleError)
    );

  }

  /*

  public find(): Observable<Contact[]> {

    return this.httpClient.get<Contact[]>(this.contactsUrl).pipe(
      tap(() => {
        this.logger.info('ContactsService: find() completed');
      }),
      catchError(this.handleError)
    );

  }

  */

  public findOne(id: string): Observable<Contact> {

    return this.httpClient.get(this.contactsUrl + id).pipe(
      map((item: any) => this.adapter.adapt(item)),
      tap(() => {
        this.logger.info('ContactsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

  /*

  public findOne(id: string): Observable<Contact> {

    return this.httpClient.get<Contact>(this.contactsUrl + id).pipe(
      tap(() => {
        this.logger.info('ContactsService: findOne() completed');
      }),
      catchError(this.handleError)
    );

  }

  */

  public create(contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.post<HttpResponse<Contact>>(this.contactsUrl, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: create() completed');
      }),
      catchError(this.handleError)
    );

  }

  public update(id: string, contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.patch<HttpResponse<Contact>>(this.contactsUrl + id, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('ContactsService: update() completed');
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

// https://angular.io/guide/http#reading-the-full-response

// https://angular.io/guide/http#getting-error-details
