import { inject, Injectable } from '@angular/core';
import { HttpResponse} from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CollectionService } from '../abstract/collection/collection';

import { Contact } from '../../models/contact';
import { Role } from '../../models/role';
import { ContactAdapter } from '../../adapters/contact.adapter';

@Injectable({
  providedIn: 'root'
})
export class ContactsService extends CollectionService {

  private adapter: ContactAdapter = inject(ContactAdapter);

  constructor() {

    super();

    this.url = this.getUrlPrefix() + '/api/party-service/individuals';

    // this.logger.info('Contacts Service: constructor()');
  }

  public find(filter: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Contacts Service: find()');

    let url = this.url;
    let queryParams;

    if (filter.length) {

      url = this.getUrlPrefix() + '/api/individuals/search/findByFamilyNameStartsWith';
      queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    } else {

      queryParams = '?page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    }

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.httpClient.get(url + queryParams, this.getHttpOptions()).pipe(

      // tap((response: any) => {
      tap(() => {

        this.logger.info('Contacts Service: find() completed');

        // this.logger.info('response: ' + JSON.stringify(response.body, null, 2) + '\n');
      })
    );

  }

  public findById(id: string): Observable<Contact> {

    return this.httpClient.get(this.url + id).pipe(

      map((item: any) => this.adapter.adapt(item)),

      tap(() => {
        this.logger.info('Contacts Service: findById() completed');
      })
    );

  }

  public create(contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.post<HttpResponse<Contact>>(this.url, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: create() completed');
      })
    );

  }

  public update(id: string, contact: Contact): Observable<HttpResponse<Contact>> {

    return this.httpClient.patch<HttpResponse<Contact>>(this.url + id, contact, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: update() completed');
      })
    );

  }

  public delete(id: string): Observable<Contact> {

    return this.httpClient.delete<Contact>(this.url + id).pipe(
      tap(() => {
        this.logger.info('Contacts Service: delete() completed');
      })
    );

  }

  public createRole(id: string, role: Role): Observable<HttpResponse<Role>>  {

    return this.httpClient.post<HttpResponse<Role>>(this.url + id + '/roles', role, this.getHttpOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: createRole() completed');
      })
    );

  }

  public deleteRole(id: string, roleId: string): Observable<Contact> {

    return this.httpClient.delete<Contact>(this.url + id + '/roles/' + roleId).pipe(
      tap(() => {
        this.logger.info('Contacts Service: deleteRole() completed');
      })
    );

  }

}
