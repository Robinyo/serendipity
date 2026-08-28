import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { AbstractCollectionService } from 'serendipity-utils-lib';

import { ContactAdapter } from '../../adapters/contact';
import { AccountModel, ContactModel } from '../../models/models';

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

  public findAllContacts(filter: string, offset: number = 0, limit: number = 100): Observable<any> {

    this.logger.info('Party Service: findAllContacts()');

    let url = this.contactsApi;
    let queryParams;

    if (filter.length) {

      url = url + '/search/findByFamilyNameStartsWith';
      queryParams = '?name=' + filter + '&page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    } else {

      queryParams = '?page=' + offset + '&size=' + limit + '&sort=name.familyName&name.familyName.dir=asc';

    }

    this.logger.info('url: ' + url);
    this.logger.info('queryParams: ' + queryParams);

    return this.http.get(url + queryParams, this.getDefaultHttpGetOptions()).pipe(

      tap(() => {
        this.logger.info('Party Service: findAllContacts() completed');
      })
    );

  }

  public findContactById(id: string): Observable<ContactModel> {

    this.logger.info('Party Service: findContactById()');

    return this.http.get<ContactModel>(`${this.contactsApi}/${id}`, this.getDefaultHttpGetOptions()).pipe(

      map((response: any) => this.adapter.adapt(response.body)),

      tap(() => {
        this.logger.info('Party Service: findContactById() completed');
      })
    );
  }

}
