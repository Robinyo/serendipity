import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractCollectionService, PagedResponse } from 'serendipity-utils-lib';

import { ContactAdapter } from '../../adapters/contact';
import { ContactModel, ContactSummaryModel } from '../../models/models';

@Injectable({
  providedIn: 'root'
})
export class PartyService extends AbstractCollectionService {

  private http = inject(HttpClient);

  // Contact is a synonym for Individual
  private readonly contactsApi = '/api/party-service/individuals';

  // Declare properties without inline injection to stabilise cross-lib evaluation
  private adapter!: ContactAdapter;

  constructor() {

    super();

    this.logger.info('Party Service: constructor()')

    // Safely resolve your library-specific adapters inside the execution window
    this.adapter = inject(ContactAdapter);

  }

  public findAllContacts(filter: string, page: number, size: number):
    Observable<PagedResponse<ContactSummaryModel, 'individuals'>> {

    this.logger.info(`Party Service: findAllContacts(filter: "${filter}", page: ${page}, size: ${size})`);

    // Determine the correct backend endpoint based on whether a filter is present
    // If no filter is set (empty string), hit the master collection.
    // If a filter is present (e.g. 'A'), route it to your custom search endpoint query mapping.

    const url = filter
      ? `${this.contactsApi}/search/findByFamilyNameStartsWith`
      : this.contactsApi;

    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'name.familyName,asc');

    if (filter) {
      params = params.set('name', filter);
    }

    const options = {
      ...this.getDefaultHttpGetOptions(),
      params: params
    };

    return this.http.get<PagedResponse<ContactSummaryModel, 'individuals'>>(url, options).pipe(
      tap(() => this.logger.info('Party Service: findAllContacts() completed'))
    );

  }

  public findContactById(id: string): Observable<ContactModel> {

    this.logger.info('Party Service: findContactById()');

    return this.http.get<ContactModel>(`${this.contactsApi}/${id}`, this.getDefaultHttpGetOptions()).pipe(

      map((response: any) => this.adapter.adapt(response)),

      tap(() => {
        this.logger.info('Party Service: findContactById() completed');
      })
    );
  }

  public createContact(contact: ContactModel): Observable<ContactModel> {

    this.logger.info('Party Service: createContact()');

    return this.http.post<ContactModel>(`${this.contactsApi}`, contact, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Party Service: createContact() completed');
      })
    );

  }

  public updateContact(id: string, contact: ContactModel): Observable<ContactModel> {

    this.logger.info('Party Service: updateContact()');

    return this.http.put<ContactModel>(`${this.contactsApi}/${id}`, contact, this.getDefaultHttpPutOptions()).pipe(
      tap(() => {
        this.logger.info('Party Service: updateContact() completed');
      })
    );

  }

  public deleteContact(id: string): Observable<void> {

    this.logger.info('Party Service: deleteContact()');

    return this.http.delete<void>(`${this.contactsApi}/${id}`, this.getDefaultHttpDeleteOptions()).pipe(
      tap(() => {
        this.logger.info('Party Service: deleteContact() completed');
      })
    );

  }

}





/*

  public createRole(id: string, role: RoleModel): Observable<HttpResponse<RoleModel>>  {

    return this.httpClient.post<HttpResponse<RoleModel>>(this.url + id + '/roles', role, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: createRole() completed');
      })
    );

  }

  public deleteRole(id: string, roleId: string): Observable<ContactModel> {

    return this.httpClient.delete<ContactModel>(this.url + id + '/roles/' + roleId, this.getDefaultHttpPostOptions()).pipe(
      tap(() => {
        this.logger.info('Contacts Service: deleteRole() completed');
      })
    );

  }

*/
